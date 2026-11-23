'use client';

import { useState, useEffect } from 'react';
import {
	Search,
	ListFilter,
	Download,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { getList } from '../../utils/api';
import { withPlus } from '../../utils/format';
import TableSkeleton from '../../components/common/TableSkeleton';

const formatDate = (val) => {
	if (!val) return '-';
	const d = new Date(val);
	return isNaN(d.getTime())
		? '-'
		: d.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: '2-digit',
			});
};

const mapWinner = (w) => ({
	date: formatDate(w.createdAt || w.drawDate),
	drawType:
		w.drawType
			? w.drawType.charAt(0) + w.drawType.slice(1).toLowerCase()
			: '-',
	winner:
		withPlus(
			w.winnerPhoneNumber || w.winnerNumber || w.number || w.phoneNumber,
		),
	prize: w.prize || w.prizeAmount || '-',
	status: w.paymentStatus || w.status || '-',
});

const Winners = () => {
	const [winners, setWinners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedPlan, setSelectedPlan] = useState('All Plans');

	useEffect(() => {
		getList('/api/user/winner/get-all', 'winners')
			.then((list) => {
				setWinners(list.map(mapWinner));
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const filtered =
		selectedPlan === 'All Plans'
			? winners
			: winners.filter(
					(w) => w.drawType.toLowerCase() === selectedPlan.toLowerCase(),
				);

	return (
		<div className=''>
			{/* Toolbar */}
			<div className='mb-6'>
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-3'>
					<div className='flex flex-col sm:flex-row sm:items-center gap-3 flex-1'>
						<div className='relative flex-1 md:max-w-md'>
							<Search
								className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
								size={20}
							/>
							<input
								type='text'
								placeholder='Search for user by phone number, subscription status, etc...'
								className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
						</div>

						<div className='flex items-center gap-2 px-4 pr-0 border border-gray-300 rounded-lg '>
							<select
								value={selectedPlan}
								onChange={(e) => setSelectedPlan(e.target.value)}
								className='px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-transparent flex-1'>
								<option>All Plans</option>
								<option>Daily</option>
								<option>Weekly</option>
								<option>Monthly</option>
							</select>

							<button className='p-2 rounded-lg hover:bg-gray-100 transition-colors bg-white'>
								<ListFilter
									size={20}
									className='text-gray-600'
								/>
							</button>
						</div>
					</div>

					<button className='flex items-center gap-2 px-4 py-2 bg-[#FFF7EB]  text-[#FAAA32] rounded-xl transition-colors md:ml-4 self-start md:self-auto shrink-0'>
						<Download size={20} />
						<span className='font-bold'>Export file</span>
					</button>
				</div>
			</div>

			{/* Table */}
			<div className='bg-white rounded-lg overflow-x-auto'>
				<table className='w-full min-w-[760px]'>
					<thead>
						<tr className=' bg-[#fffbf5]'>
							<th className='text-left px-10 p-6  font-semibold '>Date</th>
							<th className='text-left px-10 py-4  font-medium '>Draw type</th>
							<th className='text-left px-10 py-4 font-medium '>Winners</th>
							<th className='text-left px-10 py-4  font-medium '>Prize</th>
							<th className='text-left px-10 py-4  font-medium '>
								Payment Status
							</th>
							<th className='px-10 py-4'></th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<TableSkeleton rows={6} cols={6} cellClass='px-10 py-5' />
						) : filtered.length === 0 ? (
							<tr>
								<td
									colSpan={6}
									className='px-10 py-8 text-center text-gray-400'>
									No winners found
								</td>
							</tr>
						) : (
							filtered.map((winner, index) => (
								<tr
									key={index}
									className='border-b border-[#E6E6E6] hover:bg-gray-50 transition-colors'>
									<td className='px-10 py-4'>{winner.date}</td>
									<td className='px-10 py-4  font-medium'>{winner.drawType}</td>
									<td className='px-10 py-4'>{winner.winner}</td>
									<td className='px-10 py-4'>{winner.prize}</td>
									<td className='px-10 py-4'>
										<span
											className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
												winner.status === 'Paid' || winner.status === 'PAID'
													? 'bg-[#049A040F] text-[#049A04]'
													: 'bg-[#F20D0D0F] text-[#F20D0D]'
											}`}>
											{winner.status}
										</span>
									</td>
									<td className='px-6 py-4'>
										<button className='p-1 hover:bg-gray-100 rounded transition-colors'>
											<MoreVertical
												size={20}
												className='text-gray-400'
											/>
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-end gap-2 mt-6'>
				<ChevronLeft
					className='text-[#ecc78e]'
					sizes={24}
				/>

				<button className='px-4 py-2 border border-[#faaa32] rounded-full font-medium'>
					1
				</button>

				<ChevronRight
					className='text-[#ecc78e]'
					sizes={24}
				/>
			</div>
		</div>
	);
};

export default Winners;
