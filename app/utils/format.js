// "2348032414790" -> "+2348032414790"
export function withPlus(num) {
	if (!num) return '-';
	const s = String(num).trim();
	return s.startsWith('+') ? s : `+${s}`;
}

// "2348032414790" -> "+234 803 241 4790" (the spin wheel masks by these groups)
export function spacedPhone(num) {
	const d = String(num || '').replace(/\D/g, '');
	if (d.length === 13 && d.startsWith('234')) {
		return `+234 ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9)}`;
	}
	return withPlus(d);
}
