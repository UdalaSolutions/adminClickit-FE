'use client';

import { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { Dropdown } from 'antd';
import { getList } from '../../utils/api';
import { withPlus } from '../../utils/format';
import TableSkeleton from '../../components/common/TableSkeleton';
import TableToolbar from '../../components/common/TableToolbar';
import Pagination from '../../components/common/Pagination';
import DrawDetailsModal from '../../components/appDashboard/draws/DrawDetailsModal';
import { exportCsv } from '../../utils/exportCsv';

const PAGE_SIZE = 10;

const PLAN_OPTIONS = [
	{ value: 'All Plans', label: 'All plans' },
	{ value: 'Daily', label: 'Daily' },
	{ value: 'Weekly', label: 'Weekly' },
	{ value: 'Monthly', label: 'Monthly' },
];

const titleCase = (v) => (v ? v.charAt(0) + v.slice(1).toLowerCase() : '-');

const formatDate = (val, withTime = false) => {
	if (!val) return '-';
	const d = new Date(val);
	if (isNaN(d.getTime())) return '-';
	return d.toLocaleString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		...(withTime && { hour: '2-digit', minute: '2-digit' }),
	});
};

// Same instant, ignoring sub-second precision differences
const sameMoment = (a, b) =>
	a && b && Math.abs(new Date(a).getTime() - new Date(b).getTime()) < 1000;

// GET /api/user/winner/get-all has one record per phone number, with every
// win in datesWon. Draw type, prize and payment status live on the draw, so
// each win is matched to the completed draw executed at that moment.
const buildRows = (winners, draws) =>
	winners
		.flatMap((w) => {
			const dates = w.datesWon?.length ? w.datesWon : [w.dateBlock];
			return dates.map((wonAt) => {
				const draw = draws.find(
					(d) =>
						d.winnerPhoneNumber === w.phoneNumber &&
						sameMoment(d.executedDateAndTime, wonAt),
				);
				const blocked = w.dateUnblock && new Date(w.dateUnblock) > new Date();
				return {
					key: `${w.phoneNumber}-${wonAt}`,
					wonAt,
					date: formatDate(wonAt, true),
					drawType: titleCase(draw?.drawType),
					winner: withPlus(w.phoneNumber),
					prize:
						typeof draw?.prizeAmount === 'number'
							? `₦${draw.prizeAmount.toLocaleString()}`
							: '-',
					status: draw?.paymentStatus ? titleCase(draw.paymentStatus) : 'Pending',
					eligibleFrom: formatDate(w.dateUnblock),
					blocked,
					totalWins: w.datesWon?.length || 1,
					draw,
				};
			});
		})
		.sort((a, b) => new Date(b.wonAt) - new Date(a.wonAt));

const Winners = () => {
	const [rows, setRows] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedPlan, setSelectedPlan] = useState('All Plans');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const [detailsDraw, setDetailsDraw] = useState(null);

	useEffect(() => {
		Promise.all([
			getList('/api/user/winner/get-all', 'winners'),
			// Draws only add detail; winners still show if this fails
			getList('/api/user/draw/get-all', 'draws').catch(() => []),
		])
			.then(([winners, draws]) => setRows(buildRows(winners, draws)))
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const q = search.trim().toLowerCase();
	const filtered = rows.filter(
		(row) =>
			(selectedPlan === 'All Plans' ||
				row.drawType.toLowerCase() === selectedPlan.toLowerCase()) &&
			(!q ||
				[row.winner, row.drawType, row.prize, row.status, row.date].some((v) =>
					String(v || '').toLowerCase().includes(q),
				)),
	);

	// Back to page 1 when the filters change
	useEffect(() => {
		setPage(1);
	}, [search, selectedPlan]);
	const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	const handleExport = () =>
		exportCsv(
			`winners-${new Date().toISOString().slice(0, 10)}.csv`,
			[
				{ key: 'date', label: 'Date won' },
				{ key: 'drawType', label: 'Draw type' },
				{ key: 'winner', label: 'Winner' },
				{ key: 'prize', label: 'Prize' },
				{ key: 'status', label: 'Payment status' },
				{ key: 'eligibleFrom', label: 'Can win again from' },
			],
			filtered,
		);

	return (
		<div className=''>
			<TableToolbar
				search={search}
				onSearch={setSearch}
				searchPlaceholder='Search by phone number, draw type, prize or status'
				filterValue={selectedPlan}
				onFilter={setSelectedPlan}
				filterOptions={PLAN_OPTIONS}
				onExport={handleExport}
				exportDisabled={filtered.length === 0}
			/>

			<div className='bg-white rounded-lg overflow-x-auto'>
				<table className='w-full min-w-[860px]'>
					<thead>
						<tr className='bg-[#fffbf5]'>
							<th className='text-left px-6 py-4 font-semibold'>Date won</th>
							<th className='text-left px-6 py-4 font-semibold'>Draw type</th>
							<th className='text-left px-6 py-4 font-semibold'>Winner</th>
							<th className='text-left px-6 py-4 font-semibold'>Prize</th>
							<th className='text-left px-6 py-4 font-semibold'>Payment status</th>
							<th className='text-left px-6 py-4 font-semibold'>Can win again</th>
							<th className='px-6 py-4'></th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<TableSkeleton
								rows={6}
								cols={7}
							/>
						) : filtered.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className='px-6 py-8 text-center text-gray-400'>
									No winners found
								</td>
							</tr>
						) : (
							pageRows.map((row) => (
								<tr
									key={row.key}
									onClick={() => row.draw && setDetailsDraw(row.draw)}
									className={`border-b border-[#E6E6E6] hover:bg-gray-50 transition-colors ${
										row.draw ? 'cursor-pointer' : ''
									}`}>
									<td className='px-6 py-4'>{row.date}</td>
									<td className='px-6 py-4 font-medium'>{row.drawType}</td>
									<td className='px-6 py-4'>
										<span className='inline-flex items-center gap-2'>
											{row.winner}
											{row.totalWins > 1 && (
												<span className='rounded-full bg-[#FFF7EB] px-2 py-0.5 text-xs font-medium text-[#FAAA32]'>
													{row.totalWins} wins
												</span>
											)}
										</span>
									</td>
									<td className='px-6 py-4'>{row.prize}</td>
									<td className='px-6 py-4'>
										<span
											className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
												row.status === 'Paid'
													? 'bg-[#049A040F] text-[#049A04]'
													: 'bg-[#FFF7EB] text-[#FAAA32]'
											}`}>
											{row.status}
										</span>
									</td>
									<td className='px-6 py-4 text-[#666666]'>
										{row.blocked ? row.eligibleFrom : 'Now'}
									</td>
									<td
										className='px-6 py-4'
										onClick={(e) => e.stopPropagation()}>
										{row.draw && (
											<Dropdown
												trigger={['click']}
												placement='bottomRight'
												menu={{
													items: [
														{
															key: 'draw',
															label: <span className='text-sm'>View draw</span>,
														},
													],
													onClick: () => setDetailsDraw(row.draw),
												}}>
												<button
													className='p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer'
													aria-label='Winner actions'>
													<MoreVertical
														size={20}
														className='text-gray-400'
													/>
												</button>
											</Dropdown>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<Pagination
				page={page}
				pageSize={PAGE_SIZE}
				total={filtered.length}
				onPageChange={setPage}
				className='mt-6'
			/>

			<DrawDetailsModal
				open={!!detailsDraw}
				draw={detailsDraw}
				onClose={() => setDetailsDraw(null)}
			/>
		</div>
	);
};

export default Winners;
