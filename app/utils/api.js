// All calls go through the Next.js rewrite in next.config.mjs (/api/* -> backend).
const BASE_URL = '';

function getToken() {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem('token');
}

// Backend wraps every response as { data, successfully }.
// On failure `data` is usually the error message string.
async function request(path, options = {}) {
	const token = getToken();
	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		},
	});

	const json = await res.json().catch(() => ({}));

	if (!res.ok || json.successfully === false) {
		const msg =
			(typeof json.data === 'string' && json.data) ||
			json.message ||
			json.error ||
			`HTTP ${res.status}`;
		throw new Error(msg);
	}

	return json;
}

export const api = {
	get: (path) => request(path),
	post: (path, body) =>
		request(path, {
			method: 'POST',
			...(body !== undefined ? { body: JSON.stringify(body) } : {}),
		}),
	put: (path, body) =>
		request(path, { method: 'PUT', body: JSON.stringify(body) }),
	delete: (path) => request(path, { method: 'DELETE' }),
};

// GET list endpoints return { data: { <key>: [...] } }
export async function getList(path, key) {
	const json = await api.get(path);
	const list = json.data?.[key];
	return Array.isArray(list) ? list : [];
}

// POST /api/user/otp/generate — body is the raw email string, NOT { email }
export function sendOtp(email) {
	return api.post('/api/user/otp/generate', email);
}

// POST /api/user/otp/validate?recipient=&code=
// A wrong code still returns 200 with data:false, so check the value.
export async function validateOtp(email, code) {
	const json = await api.post(
		`/api/user/otp/validate?recipient=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
	);
	if (json.data !== true) throw new Error('Invalid or expired code');
	return true;
}

// Read the claims inside a JWT (no verification — display only)
function decodeJwt(token) {
	try {
		const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
		return JSON.parse(decodeURIComponent(escape(atob(part))));
	} catch {
		return {};
	}
}

// `profile` lets signup pass the names the user just typed
export async function login(email, password, profile = {}) {
	const json = await api.post('/api/user/login', { email, password });
	const d = json.data;
	const token =
		typeof d === 'string'
			? d
			: d?.token || d?.accessToken || d?.jwt || json.token || null;

	if (typeof window !== 'undefined') {
		if (token) localStorage.setItem('token', token);

		// The backend's user records have no names, so collect from every source
		const fromRes = (typeof d === 'object' && (d?.user || d)) || {};
		const claims = token ? decodeJwt(token) : {};
		const known = getNameBook()[email.toLowerCase()] || {};
		const user = {
			email,
			firstName:
				profile.firstName || fromRes.firstName || claims.firstName || known.firstName || '',
			lastName:
				profile.lastName || fromRes.lastName || claims.lastName || known.lastName || '',
			role:
				fromRes.userRole || claims.userRole || claims.role || profile.userRole || 'ADMIN',
		};
		localStorage.setItem('user', JSON.stringify(user));
		if (user.firstName) rememberName(email, user);
	}
	return json;
}

// Names typed at signup, kept per email so a later sign-in can show them
function getNameBook() {
	try {
		return JSON.parse(localStorage.getItem('userNames') || '{}');
	} catch {
		return {};
	}
}
function rememberName(email, { firstName, lastName }) {
	try {
		const book = getNameBook();
		book[email.toLowerCase()] = { firstName, lastName };
		localStorage.setItem('userNames', JSON.stringify(book));
	} catch {}
}

// Merge changes into the signed-in user and tell the header to re-render
export function updateCurrentUser(changes) {
	if (typeof window === 'undefined') return null;
	const user = { ...(getCurrentUser() || {}), ...changes };
	localStorage.setItem('user', JSON.stringify(user));
	if (user.email && (user.firstName || user.lastName)) rememberName(user.email, user);
	window.dispatchEvent(new Event('user-updated'));
	return user;
}

// The backend has no logout endpoint, so signing out just clears the session
export function logout() {
	if (typeof window === 'undefined') return;
	localStorage.removeItem('token');
	localStorage.removeItem('user');
	sessionStorage.removeItem('pendingEmail');
	sessionStorage.removeItem('pendingSignup');
}

export function getCurrentUser() {
	if (typeof window === 'undefined') return null;
	try {
		return JSON.parse(localStorage.getItem('user') || 'null');
	} catch {
		return null;
	}
}

// "Jane Doe" -> { name: "Jane Doe", initials: "JD" }; falls back to the email
export function displayName(user) {
	if (!user) return { name: 'Admin', initials: 'A' };
	const full = `${user.firstName || ''} ${user.lastName || ''}`.trim();
	const name =
		full ||
		(user.email || 'Admin')
			.split('@')[0]
			.split(/[._-]+/)
			.filter(Boolean)
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(' ');
	const initials = name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w.charAt(0).toUpperCase())
		.join('');
	return { name, initials: initials || 'A' };
}
