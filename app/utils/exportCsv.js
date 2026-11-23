// Download rows as a CSV file. columns: [{ key, label }]
export function exportCsv(filename, columns, rows) {
	const escape = (v) => {
		const s = v === null || v === undefined ? '' : String(v);
		// Quote values with commas, quotes or newlines; stop spreadsheet formula injection
		const safe = /^[=+\-@]/.test(s) && !/^\+?\d[\d\s]*$/.test(s) ? `'${s}` : s;
		return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
	};
	const lines = [
		columns.map((c) => escape(c.label)).join(','),
		...rows.map((r) => columns.map((c) => escape(r[c.key])).join(',')),
	];
	// BOM so Excel opens ₦ and other symbols correctly
	const blob = new Blob(['﻿' + lines.join('\n')], {
		type: 'text/csv;charset=utf-8',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
