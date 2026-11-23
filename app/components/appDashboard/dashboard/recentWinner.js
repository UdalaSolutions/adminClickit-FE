'use client';

import { useState } from 'react';
import { getStatusStyles } from '../../../utils/utilsFunctions';

const RecentWinners = () => {
	const [winners] = useState([
		{
			date: '01/10/25',
			drawType: 'Weekly',
			winners: '+234 806 1325 269',
			prize: '₦50,000',
			paymentStatus: 'Paid',
			statusColor: 'green',
		},
		{
			date: '01/10/25',
			drawType: 'Weekly',
			winners: '+234 806 1325 269',
			prize: '₦50,000',
			paymentStatus: 'Pending',
			statusColor: 'red',
		},
		{
			date: '01/10/25',
			drawType: 'Weekly',
			winners: '+234 806 1325 269',
			prize: '₦50,000',
			paymentStatus: 'In progress',
			statusColor: 'orange',
		},
	]);

	// Optional: handle empty state display
	const EmptyState = () => (
		<div className='text-center py-16'>
			<div className='mb-4'>
				<svg
					width='80'
					height='80'
					viewBox='0 0 80 80'
					fill='none'
					className='mx-auto'>
					<circle
						cx='40'
						cy='40'
						r='30'
						fill='#f3f4f6'
					/>
					<path
						d='M35 45L40 50L50 35'
						stroke='#9ca3af'
						strokeWidth='3'
						strokeLinecap='round'
						strokeLinejoin='round'
						fill='none'
					/>
				</svg>
			</div>
			<h3 className='text-xl font-bold mb-2'>No winners yet!</h3>
			<p className='text-sm text-gray-500 max-w-md mx-auto'>
				Once a draw is completed, the list of lucky winners will appear here.
			</p>
		</div>
	);

	return (
		<div className='bg-white rounded-xl overflow-x-auto flex-1 min-w-0'>
			<div className='p-4 flex justify-between items-center'>
				<h2 className='font-bold'>Recent winners</h2>
				{winners.length > 0 && (
					<button className='text-sm font-semibold text-[#FAAA32] transition-colors'>
						See all
					</button>
				)}
			</div>

			{winners.length === 0 ? (
				<h1>Hello </h1>
			) : (
				<div className='overflow-x-auto'>
					<table className='w-full min-w-[760px]'>
						<thead>
							<tr className='bg-[#fefbf5]'>
								<th className='text-left py-4 px-6 text-sm font-semibold text-gray-700'>
									Date
								</th>
								<th className='text-left py-4 px-6 text-sm font-semibold text-gray-700'>
									Draw type
								</th>
								<th className='text-left py-4 px-6 text-sm font-semibold text-gray-700'>
									Winners
								</th>
								<th className='text-left py-4 px-6 text-sm font-semibold text-gray-700'>
									Prize
								</th>
								<th className='text-left py-4 px-6 text-sm font-semibold text-gray-700'>
									Payment status
								</th>
							</tr>
						</thead>
						<tbody>
							{winners.map((winner, index) => (
								<tr
									key={index}
									className='border-b border-gray-50 hover:bg-gray-50 transition-colors'>
									<td className='py-4 px-6 text-sm'>{winner.date}</td>
									<td className='py-4 px-6 text-sm'>{winner.drawType}</td>
									<td className='py-4 px-6 text-sm'>{winner.winners}</td>
									<td className='py-4 px-6 text-sm font-medium'>
										{winner.prize}
									</td>
									<td className='py-4 px-6'>
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(
												winner.statusColor
											)}`}>
											{winner.paymentStatus}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default RecentWinners;
