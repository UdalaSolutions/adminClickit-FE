'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Modal, Select, DatePicker, Button, Dropdown } from 'antd';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { api, getList } from '../../utils/api';
import TableSkeleton from '../../components/common/TableSkeleton';
import ConfirmModal from '../../components/common/ConfirmModal';
import DrawDetailsModal, {
	StatusPill,
} from '../../components/appDashboard/draws/DrawDetailsModal';


const formatDate = (val) => {
	if (!val || val === '-') return '-';
	const d = new Date(val);
	return isNaN(d.getTime())
		? String(val)
		: d
				.toLocaleString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
				})
				.replace(',', '');
};

const mapDraw = (d) => ({
	id: d.id || '-',
	// Human-friendly reference once the backend fills it in; else the UUID
	ref: d.referenceNumber || d.id || '-',
	drawType: titleCase(d.drawType),
	scheduleTime: formatDate(d.scheduledDateAndTime),
	executedTime: formatDate(d.executedDateAndTime),
	status: titleCase(d.status),
	entries: (d.participants || d.usersParticipatedIds || []).length,
	rawStatus: d.status,
	raw: d, // full backend object for the details panel
});

const titleCase = (v) =>
	v ? v.charAt(0) + v.slice(1).toLowerCase() : '-';

// Backend expects a Java LocalDateTime: "YYYY-MM-DDTHH:mm:ss" (no timezone)
const toLocalDateTime = (d) => d.second(0).format('YYYY-MM-DDTHH:mm:ss');

// Draws are created automatically by the backend. Manual creation
// (POST /api/user/draw/create) is untested on the backend, so it is off.
// Set to true to re-enable the Create draw button and form.
const MANUAL_DRAW_CREATION = false;

const emptyForm = { drawType: undefined, scheduledDateAndTime: null };

const DrawManagement = () => {
	const router = useRouter();
	const [draws, setDraws] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [submitting, setSubmitting] = useState(null); // 'schedule' | 'run' | null

	const loadDraws = () =>
		getList('/api/user/draw/get-all', 'draws')
			.then((list) => setDraws(list.map(mapDraw)))
			.catch((err) => toast.error(err.message || 'Failed to load draws'))
			.finally(() => setLoading(false));

	useEffect(() => {
		loadDraws();
	}, []);

	const closeModal = () => {
		setIsCreateModalOpen(false);
		setForm(emptyForm);
	};

	// POST /api/user/draw/create  { drawType, scheduledDateAndTime, status }
	const createDraw = (scheduledDateAndTime) =>
		api.post('/api/user/draw/create', {
			drawType: form.drawType,
			scheduledDateAndTime: toLocalDateTime(scheduledDateAndTime),
			status: 'PENDING',
		});

	const handleSchedule = async () => {
		if (!form.drawType) return toast.error('Select a draw type');
		if (!form.scheduledDateAndTime)
			return toast.error('Select the date and time for the draw');
		if (form.scheduledDateAndTime.isBefore(dayjs()))
			return toast.error('Scheduled time must be in the future');
		setSubmitting('schedule');
		try {
			await createDraw(form.scheduledDateAndTime);
			toast.success('Draw scheduled');
			closeModal();
			loadDraws();
		} catch (err) {
			toast.error(err.message || 'Failed to schedule draw');
		} finally {
			setSubmitting(null);
		}
	};

	const [drawToDelete, setDrawToDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);

	const confirmDeleteDraw = async () => {
		if (!drawToDelete) return;
		setDeleting(true);
		try {
			await api.delete(`/api/user/draw/delete/${drawToDelete.id}`);
			toast.success('Draw deleted');
		} catch (err) {
			toast.error(err.message || 'Failed to delete draw');
		} finally {
			setDeleting(false);
			setDrawToDelete(null);
			loadDraws();
		}
	};

	const [detailsDraw, setDetailsDraw] = useState(null);

	// A draw can only be executed once subscribers have entered it
	const runDraw = (draw) => {
		if (!draw.entries) {
			return toast.error('This draw has no participants yet, so it cannot be run.');
		}
		router.push(`/spin?drawId=${draw.id}`);
	};

	const rowMenu = (draw) => ({
		items: [
			{
				key: 'details',
				label: (
					<span className='text-sm'>
						{draw.rawStatus === 'COMPLETED' ? 'View winner & participants' : 'View participants'}
					</span>
				),
			},
			...(draw.status !== 'Completed'
				? [
						{
							key: 'run',
							label: <span className='text-sm'>Run draw</span>,
						},
					]
				: []),
			{
				key: 'delete',
				label: <span className='text-sm'>Delete draw</span>,
			},
		],
		onClick: ({ key, domEvent }) => {
			domEvent?.stopPropagation();
			if (key === 'details') return setDetailsDraw(draw);
			if (key === 'delete') return setDrawToDelete(draw);
			runDraw(draw);
		},
	});

	// The spin page sends us back here with a message if the draw can't run
	useEffect(() => {
		try {
			const msg = sessionStorage.getItem('drawError');
			if (msg) {
				sessionStorage.removeItem('drawError');
				toast.error(msg);
			}
		} catch {}
	}, []);

	return (
		<div className=''>
			{/* Header */}
			<div className='flex justify-end items-center mb-6'>
				<button
					onClick={() => MANUAL_DRAW_CREATION && setIsCreateModalOpen(true)}
					disabled={!MANUAL_DRAW_CREATION}
					className='bg-[#FAAA32] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
					<Plus /> Create draw
				</button>
			</div>

			{/* Table */}
			<div className='bg-white rounded-lg overflow-x-auto shadow-sm'>
				<table className='w-full min-w-[760px]'>
					<thead>
						<tr className='bg-[#FFFBF5] border-b border-gray-200'>
							<th className='text-left px-6 py-4 font-semibold '>Draw ID</th>
							<th className='text-left px-6 py-4 font-semibold '>Draw type</th>
							<th className='text-left px-6 py-4 font-semibold '>
								Scheduled time
							</th>
							<th className='text-left px-6 py-4 font-semibold '>
								Executed time
							</th>
							<th className='text-left px-6 py-4 font-semibold '>Entries</th>
						<th className='text-left px-6 py-4 font-semibold '>Status</th>
							<th className='px-6 py-4'></th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<TableSkeleton rows={5} cols={7} />
						) : draws.length === 0 ? (
							<tr>
								<td
									colSpan={7}
									className='px-6 py-8 text-center text-gray-400'>
									No draws found
								</td>
							</tr>
						) : (
							draws.map((draw) => (
								<tr
									key={draw.id}
									onClick={() => setDetailsDraw(draw)}
									className='border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer'>
									<td className='px-6 py-4 text-foreground'>{draw.ref}</td>
									<td className='px-6 py-4 '>{draw.drawType}</td>
									<td className='px-6 py-4 text-foreground'>
										{draw.scheduleTime}
									</td>
									<td className='px-6 py-4 text-foreground'>
										{draw.executedTime}
									</td>
									<td className='px-6 py-4 text-foreground'>{draw.entries}</td>
									<td className='px-6 py-4 text-foreground'>
										<StatusPill status={draw.rawStatus} />
									</td>
									<td
										className='px-6 py-4'
										onClick={(e) => e.stopPropagation()}>
										<Dropdown
											menu={rowMenu(draw)}
											trigger={['click']}
											placement='bottomRight'>
											<button
												className='p-1 hover:bg-gray-100 rounded transition-colors cursor-pointer'
												aria-label='Draw actions'>
												<MoreVertical
													size={20}
													className='text-foreground'
												/>
											</button>
										</Dropdown>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-end gap-2 mt-6'>
				<button className='p-2 hover:bg-gray-100 rounded transition-colors'>
					<ChevronLeft
						size={20}
						className='text-[#fad296]'
					/>
				</button>
				<button className='px-4 py-2 border-[#faaa32] border rounded-full font-medium'>
					1
				</button>
				<button className='p-2 hover:bg-gray-100 rounded transition-colors'>
					<ChevronRight
						size={20}
						className='text-[#fad296]'
					/>
				</button>
			</div>

			<DrawDetailsModal
				open={!!detailsDraw}
				draw={detailsDraw?.raw}
				onClose={() => setDetailsDraw(null)}
				onRun={() => {
					const d = detailsDraw;
					setDetailsDraw(null);
					runDraw(d);
				}}
			/>

			<ConfirmModal
				open={!!drawToDelete}
				title='Delete draw?'
				message={
					drawToDelete &&
					`This ${drawToDelete.drawType.toLowerCase()} draw scheduled for ${drawToDelete.scheduleTime} will be permanently deleted.`
				}
				confirmText='Delete draw'
				loading={deleting}
				onConfirm={confirmDeleteDraw}
				onCancel={() => setDrawToDelete(null)}
			/>

			{/* Create Draw Modal — fields match backend CreateDrawRequest */}
			<Modal
				title='Create draw'
				open={isCreateModalOpen}
				onCancel={closeModal}
				footer={null}
				width={500}>
				<div className='space-y-5 mt-6'>
					<div>
						<label className='block font-medium mb-2 text-[#999999]'>
							Draw type
						</label>
						<Select
							placeholder='Select draw type'
							value={form.drawType}
							onChange={(drawType) => setForm({ ...form, drawType })}
							size='large'
							className='w-full'
							options={[
								{ value: 'DAILY', label: 'Daily draw' },
								{ value: 'WEEKLY', label: 'Weekly draw' },
								{ value: 'MONTHLY', label: 'Monthly draw' },
							]}
						/>
					</div>

					<div>
						<label className='block font-medium mb-2 text-[#999999]'>
							Scheduled date &amp; time
						</label>
						<DatePicker
							showTime={{ format: 'hh:mm A', use12Hours: true, minuteStep: 5 }}
							format='DD MMM YYYY, hh:mm A'
							placeholder='Select date and time'
							value={form.scheduledDateAndTime}
							onChange={(d) => setForm({ ...form, scheduledDateAndTime: d })}
							disabledDate={(d) => d && d.isBefore(dayjs(), 'day')}
							size='large'
							className='w-full'
						/>
						<p className='text-sm text-[#999999] mt-1'>
							Subscribers are entered into the draw until it runs. Run it from the
							table once it has entries.
						</p>
					</div>

					<Button
						type='primary'
						onClick={handleSchedule}
						loading={submitting === 'schedule'}
						disabled={!!submitting}
						size='large'
						className='w-full bg-[#FAAA32]! text-foreground! border-0 font-semibold'>
						Create draw
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default DrawManagement;
