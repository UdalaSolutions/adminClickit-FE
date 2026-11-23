// Placeholder rows shown inside a <tbody> while table data loads
const widths = ['w-20', 'w-28', 'w-16', 'w-24', 'w-14', 'w-20', 'w-12'];

export default function TableSkeleton({ rows = 6, cols = 5, cellClass = 'px-6 py-5' }) {
	return Array.from({ length: rows }).map((_, r) => (
		<tr
			key={r}
			className='border-b border-[#E6E6E6] animate-pulse'>
			{Array.from({ length: cols }).map((_, c) => (
				<td
					key={c}
					className={cellClass}>
					<div
						className={`h-3.5 rounded-full bg-[#F0F0F0] ${widths[(r + c) % widths.length]}`}
					/>
				</td>
			))}
		</tr>
	));
}
