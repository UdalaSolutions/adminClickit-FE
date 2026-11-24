'use client';

import { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { Trophy, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { withPlus } from '../../../utils/format';
import Pagination from '../../common/Pagination';

const PAGE_SIZE = 10;

const titleCase = (v) => (v ? v.charAt(0) + v.slice(1).toLowerCase() : '-');

const formatDateTime = (val) => {
	if (!val) return '—';
	const d = new Date(val);
	return isNaN(d.getTime())
		? String(val)
		: d.toLocaleString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
};

export const STATUS_STYLES = {
	COMPLETED: 'bg-[#049A040F] text-[#049A04]',
	ONGOING: 'bg-[#FFF7EB] text-[#FAAA32]',
	PENDING: 'bg-[#9999991A] text-[#666666]',
	CANCELLED: 'bg-[#F20D0D0F] text-[#F20D0D]',
};

export function StatusPill({ status }) {
	return (
		<span
			className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
				STATUS_STYLES[status] || STATUS_STYLES.PENDING
			}`}>
			{titleCase(status)}
		</span>
	);
}

// draw = raw object from GET /api/user/draw/get-all
export default function DrawDetailsModal({ draw, open, onClose, onRun }) {
	const [page, setPage] = useState(1);
	// Back to page 1 whenever a different draw is opened
	useEffect(() => {
		setPage(1);
	}, [draw?.id]);

	if (!draw) return null;

	const participants = draw.participants || [];
	const uniquePeople = new Set(
		participants.map((p) => p.subscriberId || p.phoneNumber),
	).size;
	const isCompleted = draw.status === 'COMPLETED';
	const winnerId = draw.winnerId;
	const winnerEntries = participants.filter(
		(p) =>
			(winnerId && p.subscriberId === winnerId) ||
			(!winnerId && p.phoneNumber === draw.winnerPhoneNumber),
	).length;

	const prize =
		typeof draw.prizeAmount === 'number'
			? `₦${draw.prizeAmount.toLocaleString()}`
			: '—';

	const info = [
		{ label: 'Scheduled', value: formatDateTime(draw.scheduledDateAndTime) },
		{ label: 'Executed', value: formatDateTime(draw.executedDateAndTime) },
		{
			label: 'Entries',
			value: `${participants.length.toLocaleString()} from ${uniquePeople.toLocaleString()} ${
				uniquePeople === 1 ? 'subscriber' : 'subscribers'
			}`,
		},
		{ label: 'Prize', value: prize },
		{ label: 'Payment status', value: draw.paymentStatus ? titleCase(draw.paymentStatus) : '—' },
	];

	const copyId = () => {
		navigator.clipboard
			?.writeText(draw.id)
			.then(() => toast.success('Draw ID copied'))
			.catch(() => {});
	};

	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			centered
			width={720}>
			<div className='flex flex-col max-h-[calc(85vh-40px)]'>
				{/* Header (stays put) */}
				<div className='shrink-0 pb-4 border-b border-[#F0F0F0]'>
				<div className='flex flex-wrap items-center gap-3 pr-8'>
					<h3 className='text-xl font-bold text-[#1A1A1A]'>
						{titleCase(draw.drawType)} draw
					</h3>
					<StatusPill status={draw.status} />
				</div>
				{draw.referenceNumber && (
					<p className='mt-1 text-sm font-medium text-[#1A1A1A]'>
						Ref: {draw.referenceNumber}
					</p>
				)}
				<button
					type='button'
					onClick={copyId}
					className='mt-1 inline-flex items-center gap-1.5 text-xs text-[#999999] hover:text-[#1A1A1A] cursor-pointer'>
					{draw.id}
					<Copy size={12} />
				</button>
				</div>

				{/* Scrollable body */}
				<div className='flex-1 min-h-0 overflow-y-auto no-scrollbar -mx-6 px-6 pb-2'>

				{/* Winner */}
				{isCompleted && draw.winnerPhoneNumber && (
					<div className='mt-5 flex items-center gap-4 rounded-xl border border-[#FAAA32]/40 bg-[#FFF7EB] p-4'>
						<div className='h-12 w-12 shrink-0 rounded-full bg-white flex items-center justify-center'>
							<Trophy
								size={22}
								className='text-[#FAAA32]'
							/>
						</div>
						<div className='min-w-0'>
							<p className='text-xs font-medium text-[#999999]'>Winner</p>
							<p className='text-lg font-bold text-[#1A1A1A] tabular-nums'>
								{withPlus(draw.winnerPhoneNumber)}
							</p>
							{participants.length > 0 && (
								<p className='text-xs text-[#999999]'>
									Held {winnerEntries} of {participants.length}{' '}
									{participants.length === 1 ? 'entry' : 'entries'}
								</p>
							)}
						</div>
					</div>
				)}

				{/* Info grid */}
				<div className='mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-[#F0F0F0] p-4'>
					{info.map((item) => (
						<div key={item.label}>
							<p className='text-xs text-[#999999] mb-0.5'>{item.label}</p>
							<p className='text-sm font-medium text-[#1A1A1A]'>{item.value}</p>
						</div>
					))}
				</div>

				{/* Participants */}
				<div className='mt-6'>
					<div className='flex items-center justify-between mb-3'>
						<h4 className='font-bold text-[#1A1A1A]'>Participants</h4>
						<span className='text-sm text-[#999999]'>
							{participants.length.toLocaleString()}{' '}
							{participants.length === 1 ? 'entry' : 'entries'}
						</span>
					</div>

					{participants.length === 0 ? (
						<div className='rounded-xl bg-[#FAFAFA] py-10 text-center text-sm text-[#999999]'>
							No one has entered this draw yet. Subscribers are added as they
							subscribe or renew.
						</div>
					) : (
						<>
						<div className='overflow-x-auto rounded-xl border border-[#F0F0F0]'>
							<table className='w-full min-w-[520px] text-sm'>
								<thead className='bg-[#FFFBF5]'>
									<tr>
										<th className='text-left font-semibold px-4 py-3 w-12'>#</th>
										<th className='text-left font-semibold px-4 py-3'>
											Phone number
										</th>
										<th className='text-left font-semibold px-4 py-3'>Plan</th>
										<th className='text-left font-semibold px-4 py-3'>
											Entered at
										</th>
									</tr>
								</thead>
								<tbody>
									{participants
									.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
									.map((p, idx) => {
									const i = (page - 1) * PAGE_SIZE + idx;
										const isWinner =
											isCompleted &&
											((winnerId && p.subscriberId === winnerId) ||
												(!winnerId &&
													p.phoneNumber === draw.winnerPhoneNumber));
										return (
											<tr
												key={`${p.subscriberId}-${p.enteredAt}-${i}`}
												className={`border-t border-[#F0F0F0] ${
													isWinner ? 'bg-[#FFF7EB]/60' : ''
												}`}>
												<td className='px-4 py-3 text-[#999999]'>{i + 1}</td>
												<td className='px-4 py-3 font-medium text-[#1A1A1A]'>
													<span className='inline-flex items-center gap-2'>
														{withPlus(p.phoneNumber)}
														{isWinner && (
															<span className='inline-flex items-center gap-1 rounded-full bg-[#FAAA32] px-2 py-0.5 text-[11px] font-semibold text-[#1A1A1A]'>
																<Trophy size={11} />
																Winner
															</span>
														)}
													</span>
												</td>
												<td className='px-4 py-3'>{titleCase(p.subscriptionType)}</td>
												<td className='px-4 py-3 text-[#666666]'>
													{formatDateTime(p.enteredAt)}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<Pagination
							page={page}
							pageSize={PAGE_SIZE}
							total={participants.length}
							onPageChange={setPage}
							className='mt-3'
						/>
						</>
					)}
				</div>

				</div>

				{/* Actions (stay put) */}
				<div className='shrink-0 pt-4 border-t border-[#F0F0F0] flex flex-col-reverse sm:flex-row sm:justify-end gap-3'>
					<button
						type='button'
						onClick={onClose}
						className='py-3 px-6 rounded-xl font-semibold border border-[#FAAA32] text-[#FAAA32] bg-white cursor-pointer'>
						Close
					</button>
					{!isCompleted && (
						<button
							type='button'
							onClick={() => onRun?.(draw)}
							className='py-3 px-6 rounded-xl font-bold bg-[#FAAA32] text-[#1A1A1A] cursor-pointer'>
							Run draw
						</button>
					)}
				</div>
			</div>
		</Modal>
	);
}
