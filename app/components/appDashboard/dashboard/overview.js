'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const Overview = () => {
	const [filter, setFilter] = useState('Weekly');

	// Example data - you can replace with actual data
	const overviews = [
		{
			label: 'Active subscribers',
			figure: '3,200',
			subtext: '20% vs last week',
			trend: 'up',
			hasData: true,
		},
		{
			label: 'New subscribers',
			figure: '1,100',
			subtext: '20% vs last week',
			trend: 'down',
			hasData: true,
		},
		{
			label: 'Revenue generated',
			figure: '₦2,000,000',
			subtext: '20% vs last week',
			trend: 'up',
			hasData: true,
		},
		{
			label: 'Total payouts',
			figure: '₦600,000',
			subtext: '1 payout pending',
			trend: 'neutral',
			hasData: true,
		},
	];

	return (
		<section className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h1 className='font-bold text-xl'>Overview</h1>

				{/* Filter Dropdown */}
				<div className='relative'>
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value)}
						className='appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
						<option value='Daily'>Daily</option>
						<option value='Weekly'>Weekly</option>
						<option value='Monthly'>Monthly</option>
						<option value='Yearly'>Yearly</option>
					</select>
					<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500'>
						<svg
							className='w-4 h-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M19 9l-7 7-7-7'
							/>
						</svg>
					</div>
				</div>
			</div>

			<div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-4'>
				{overviews.map((overview, index) => (
					<div
						key={index}
						className='bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-4 '>
						<p className='text-gray-600 text-sm font-medium'>
							{overview.label}
						</p>

						{overview.hasData ? (
							<>
								<h1 className='text-gray-900 font-bold text-3xl leading-9'>
									{overview.figure}
								</h1>

								<div className='flex items-center gap-1.5'>
									{overview.trend === 'up' && (
										<>
											<ArrowUp className='w-4 h-4 text-[#049A04]' />
											<span className='text-sm text-[#049A04] font-medium'>
												{overview.subtext}
											</span>
										</>
									)}
									{overview.trend === 'down' && (
										<>
											<ArrowDown className='w-4 h-4 text-red-600' />
											<span className='text-sm text-red-600 font-medium'>
												{overview.subtext}
											</span>
										</>
									)}
									{overview.trend === 'neutral' && (
										<span className='text-sm text-[#F20D0D] font-medium'>
											{overview.subtext}
										</span>
									)}
								</div>
							</>
						) : (
							<>
								<h1 className='text-gray-900 font-bold text-3xl leading-9'>
									0
								</h1>
								<span className='text-sm text-gray-400'>------</span>
							</>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default Overview;
