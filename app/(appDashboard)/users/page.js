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

const mapUser = (u) => ({
	date: formatDate(u.dateThatTheSubscriptionIsValid),
	channel: u.registrationChannel || '-',
	autoRenew: u.autoRenew === true,
	phone: withPlus(u.number || u.phoneNumber),
	plan:
		u.subscriptionType
			? u.subscriptionType.charAt(0) + u.subscriptionType.slice(1).toLowerCase()
			: '-',
	// Backend has no status field; active = subscription still valid
	status:
		u.dateThatTheSubscriptionIsValid &&
		new Date(u.dateThatTheSubscriptionIsValid) > new Date()
			? 'Active'
			: 'Inactive',
});

const Users = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedPlan, setSelectedPlan] = useState('All Plans');

	useEffect(() => {
		getList('/api/user/subscriber/get-all', 'subscribers')
			.then((list) => {
				setUsers(list.map(mapUser));
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const filtered =
		selectedPlan === 'All Plans'
			? users
			: users.filter(
					(u) => u.plan.toLowerCase() === selectedPlan.toLowerCase(),
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
							<th className='text-left px-10 p-6  font-semibold '>Valid until</th>
							<th className='text-left px-10 py-4  font-medium '>
								Phone number
							</th>
							<th className='text-left px-10 py-4 font-medium '>
								Subscription plan
							</th>
							<th className='text-left px-10 py-4 font-medium '>Channel</th>
							<th className='text-left px-10 py-4 font-medium '>Auto-renew</th>
							<th className='text-left px-10 py-4  font-medium '>Status</th>
							<th className='px-10 py-4'></th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<TableSkeleton rows={7} cols={7} cellClass='px-10 py-5' />
						) : filtered.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className='px-10 py-8 text-center text-gray-400'>
									No users found
								</td>
							</tr>
						) : (
							filtered.map((user, index) => (
								<tr
									key={index}
									className='border-b border-[#E6E6E6] hover:bg-gray-50 transition-colors'>
									<td className='px-10 py-4'>{user.date}</td>
									<td className='px-10 py-4  font-medium'>{user.phone}</td>
									<td className='px-10 py-4'>{user.plan}</td>
									<td className='px-10 py-4'>{user.channel}</td>
									<td className='px-10 py-4'>
										{user.autoRenew ? 'On' : 'Off'}
									</td>
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

export default Users;
