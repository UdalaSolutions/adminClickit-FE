'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

// Page numbers with ellipses: 1 … 4 5 6 … 12
const pageList = (page, totalPages) => {
	if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
	const pages = new Set([1, totalPages, page - 1, page, page + 1]);
	const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
	const out = [];
	sorted.forEach((p, i) => {
		if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
		out.push(p);
	});
	return out;
};

export default function Pagination({
	page,
	pageSize,
	total,
	onPageChange,
	className = '',
	showSummary = true,
}) {
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	if (total === 0) return null;

	const from = (page - 1) * pageSize + 1;
	const to = Math.min(total, page * pageSize);

	const btn =
		'h-9 min-w-9 px-2 flex items-center justify-center rounded-full text-sm transition-colors';

	return (
		<div
			className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
			{showSummary ? (
				<p className='text-sm text-[#999999]'>
					Showing {from}–{to} of {total.toLocaleString()}
				</p>
			) : (
				<span />
			)}

			{totalPages > 1 && (
				<div className='flex items-center gap-1'>
					<button
						type='button'
						onClick={() => onPageChange(page - 1)}
						disabled={page === 1}
						aria-label='Previous page'
						className={`${btn} text-[#FAAA32] hover:bg-[#FFF7EB] cursor-pointer disabled:text-[#fad296] disabled:hover:bg-transparent disabled:cursor-not-allowed`}>
						<ChevronLeft size={18} />
					</button>

					{pageList(page, totalPages).map((p, i) =>
						p === '…' ? (
							<span
								key={`gap-${i}`}
								className='px-1 text-sm text-[#999999]'>
								…
							</span>
						) : (
							<button
								key={p}
								type='button'
								onClick={() => onPageChange(p)}
								aria-current={p === page ? 'page' : undefined}
								className={`${btn} font-medium cursor-pointer ${
									p === page
										? 'border border-[#FAAA32] text-[#1A1A1A]'
										: 'text-[#666666] hover:bg-[#FFF7EB]'
								}`}>
								{p}
							</button>
						),
					)}

					<button
						type='button'
						onClick={() => onPageChange(page + 1)}
						disabled={page === totalPages}
						aria-label='Next page'
						className={`${btn} text-[#FAAA32] hover:bg-[#FFF7EB] cursor-pointer disabled:text-[#fad296] disabled:hover:bg-transparent disabled:cursor-not-allowed`}>
						<ChevronRight size={18} />
					</button>
				</div>
			)}
		</div>
	);
}
