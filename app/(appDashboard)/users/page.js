'use client';

import { useState } from 'react';
import {
	Search,
	ListFilter,
	Download,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
import { users } from '../../utils/utils';

const Users = () => {
	const [selectedPlan, setSelectedPlan] = useState('All Plans');

	return (
		<div className=''>
			{/* Toolbar */}
			<div className='mb-6'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-4 flex-1'>
						<div className='relative flex-1 max-w-md'>
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

					<button className='flex items-center gap-2 px-4 py-2 bg-[#FFF7EB]  text-[#FAAA32] rounded-xl transition-colors ml-4'>
						<Download size={20} />
						<span className='font-bold'>Export file</span>
					</button>
				</div>
			</div>

			{/* Table */}
			<div className='bg-white rounded-lg overflow-hidden'>
				<table className='w-full'>
					<thead>
						<tr className=' bg-[#fffbf5]'>
							<th className='text-left px-10 p-6  font-semibold '>Date</th>
							<th className='text-left px-10 py-4  font-medium '>
								Phone number
							</th>
							<th className='text-left px-10 py-4 font-medium '>
								Subscription plan
							</th>
							<th className='text-left px-10 py-4  font-medium '>Status</th>
							<th className='px-10 py-4'></th>
						</tr>
					</thead>
					<tbody>
						{users.map((user, index) => (
							<tr
								key={index}
								className='border-b border-[#E6E6E6] hover:bg-gray-50 transition-colors'>
								<td className='px-10 py-4'>{user.date}</td>
								<td className='px-10 py-4  font-medium'>{user.phone}</td>
								<td className='px-10 py-4'>{user.plan}</td>
								<td className='px-10 py-4'>
									<span
										className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
											user.status === 'Active' ?
												'bg-[#049A040F] text-[#049A04]'
											:	'bg-[#F20D0D0F] text-[#F20D0D]'
										}`}>
										{user.status}
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
						))}
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

export default Users;
