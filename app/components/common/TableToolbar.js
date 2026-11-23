'use client';

import { Search, Download } from 'lucide-react';
import Dropdown from './Dropdown';

// Search box + plan filter + export, shared by the Users and Winners tables
export default function TableToolbar({
	search,
	onSearch,
	searchPlaceholder = 'Search...',
	filterValue,
	onFilter,
	filterOptions = [],
	onExport,
	exportDisabled = false,
}) {
	return (
		<div className='mb-6 flex flex-col md:flex-row md:items-center gap-3'>
			<div className='relative flex-1 md:max-w-md'>
				<Search
					size={18}
					className='absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none'
				/>
				<input
					type='search'
					value={search}
					onChange={(e) => onSearch(e.target.value)}
					placeholder={searchPlaceholder}
					className='w-full h-11 pl-10 pr-4 bg-white border border-[#E6E6E6] rounded-xl text-sm text-[#1A1A1A] placeholder:text-[#999999] outline-none focus:border-[#FAAA32] focus:ring-1 focus:ring-[#FAAA32]'
				/>
			</div>

			<div className='flex items-center gap-3 md:ml-auto'>
				{filterOptions.length > 0 && (
					<Dropdown
						value={filterValue}
						onChange={onFilter}
						options={filterOptions}
						ariaLabel='Filter by plan'
						className='flex-1 md:flex-none md:w-44'
					/>
				)}

				{onExport && (
					<button
						type='button'
						onClick={onExport}
						disabled={exportDisabled}
						className='h-11 px-4 flex items-center gap-2 bg-white border border-[#E6E6E6] text-[#1A1A1A] rounded-xl font-medium text-sm cursor-pointer shrink-0 hover:border-[#FAAA32] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
						<Download
							size={18}
							className='text-[#FAAA32]'
						/>
						Export CSV
					</button>
				)}
			</div>
		</div>
	);
}
