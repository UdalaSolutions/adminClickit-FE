'use client';

import { useState } from 'react';
import {
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	CloudUpload,
	Calendar,
	Plus,
} from 'lucide-react';
import { Modal, Input, Select, DatePicker, Button, Tag, message } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const initialDraws = [
	{
		id: '#001001',
		drawType: 'Weekly draw',
		scheduleTime: '01/11/25, 11:00 AM',
		executedTime: '01/11/25, 11:30 AM',
		status: 'Ongoing',
	},
	{
		id: '#001002',
		drawType: 'Weekly draw',
		scheduleTime: '01/11/25, 11:00 AM',
		executedTime: '01/11/25, 11:30 AM',
		status: 'Completed',
	},
	{
		id: '#001002',
		drawType: 'Weekly draw',
		scheduleTime: '01/11/25, 11:00 AM',
		executedTime: '01/11/25, 11:30 AM',
		status: 'Pending',
	},
];

const DrawManagement = () => {
	const [draws, setDraws] = useState(initialDraws);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
	const [newDraw, setNewDraw] = useState({
		name: '',
		type: '',
		platform: 'Youtube',
		file: null,
		scheduleDate: null,
		scheduleTime: null,
	});

	const handleCreateDraw = () => {
		setIsCreateModalOpen(true);
	};

	const handleScheduleClick = () => {
		if (!newDraw.name || !newDraw.type) {
			message.error('Please fill in draw name and type');
			return;
		}
		setIsCreateModalOpen(false);
		setIsScheduleModalOpen(true);
	};

	const handleRunDraw = () => {
		if (!newDraw.name || !newDraw.type) {
			message.error('Please fill in draw name and type');
			return;
		}

		const now = new Date();
		const newDrawEntry = {
			id: `#00${draws.length + 1001}`,
			drawType: newDraw.type,
			scheduleTime: now
				.toLocaleString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
				})
				.replace(',', ''),
			executedTime: now
				.toLocaleString('en-US', {
					month: '2-digit',
					day: '2-digit',
					year: '2-digit',
					hour: '2-digit',
					minute: '2-digit',
				})
				.replace(',', ''),
			status: 'Ongoing',
		};

		setDraws([newDrawEntry, ...draws]);
		message.success('Draw created and running!');
		resetModal();
	};

	const handleSaveSchedule = () => {
		if (!newDraw.scheduleDate || !newDraw.scheduleTime) {
			message.error('Please select date and time');
			return;
		}

		const scheduleDateTime = `${newDraw.scheduleDate.format('MM/DD/YY')}, ${
			newDraw.scheduleTime
		}`;
		const newDrawEntry = {
			id: `#00${draws.length + 1001}`,
			drawType: newDraw.type,
			scheduleTime: scheduleDateTime,
			executedTime: '-',
			status: 'Pending',
		};

		setDraws([newDrawEntry, ...draws]);
		message.success('Draw scheduled successfully!');
		resetModal();
	};

	const resetModal = () => {
		setIsCreateModalOpen(false);
		setIsScheduleModalOpen(false);
		setNewDraw({
			name: '',
			type: '',
			platform: 'Youtube',
			file: null,
			scheduleDate: null,
			scheduleTime: null,
		});
	};

	return (
		<div className=''>
			{/* Header */}
			<div className='flex justify-end items-center mb-6'>
				<button
					onClick={handleCreateDraw}
					className='bg-[#FAAA32]  px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors cursor-pointer'>
					<Plus /> Create draw
				</button>
			</div>

			{/* Table */}
			<div className='bg-white rounded-lg overflow-hidden shadow-sm'>
				<table className='w-full'>
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
							<th className='text-left px-6 py-4 font-semibold '>Status</th>
							<th className='px-6 py-4'></th>
						</tr>
					</thead>
					<tbody>
						{draws.map((draw, index) => (
							<tr
								key={index}
								className='border-b border-gray-100 hover:bg-gray-50 transition-colors'>
								<td className='px-6 py-4 text-foreground'>{draw.id}</td>
								<td className='px-6 py-4 '>{draw.drawType}</td>
								<td className='px-6 py-4 text-foreground'>
									{draw.scheduleTime}
								</td>
								<td className='px-6 py-4 text-foreground'>
									{draw.executedTime}
								</td>
								<td className='px-6 py-4 text-foreground'>{draw.status}</td>
								<td className='px-6 py-4'>
									<button className='p-1 hover:bg-gray-100 rounded transition-colors'>
										<MoreVertical
											size={20}
											className='text-foreground'
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

			{/* Create Draw Modal */}
			<Modal
				title='Create draw'
				open={isCreateModalOpen}
				onCancel={resetModal}
				footer={null}
				width={530}>
				<div className='space-y-4 mt-6'>
					<div>
						<label className='block  font-medium  mb-2 text-[#999999]'>
							Draw name
						</label>
						<Input
							placeholder='Enter draw name here'
							value={newDraw.name}
							onChange={(e) => setNewDraw({ ...newDraw, name: e.target.value })}
							size='large'
							className='focus:outline-none! focus:ring-0! text-[#999999]! outline-0!'
						/>
					</div>

					<div>
						<label className='block  font-medium  mb-2 text-[#999999]'>
							Draw type
						</label>
						<Select
							placeholder='Select draw type'
							value={newDraw.type || undefined}
							onChange={(value) => setNewDraw({ ...newDraw, type: value })}
							size='large'
							className='w-full'>
							<Option value='Weekly draw'>Weekly draw</Option>
							<Option value='Monthly draw'>Monthly draw</Option>
							<Option value='Daily draw'>Daily draw</Option>
						</Select>
					</div>

					<div>
						<label className='block  font-medium  mb-2 text-[#999999]'>
							Streaming platform
						</label>
						<Input
							value={newDraw.platform}
							onChange={(e) =>
								setNewDraw({ ...newDraw, platform: e.target.value })
							}
							size='large'
						/>
					</div>

					<div>
						<div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#FF9900] transition-colors cursor-pointer'>
							<CloudUpload
								className='mx-auto text-foreground mb-2'
								size={32}
							/>

							<p className='text-foreground'>
								<span className='text-[#FF9900] font-medium'>
									Click to upload
								</span>{' '}
								Or drag and drop your files here
							</p>
							<p className='text-sm text-foreground mt-1'>
								CSV or Excel files(xlsx, 25MB)
							</p>
						</div>
					</div>

					<div className='flex gap-3 mt-6'>
						<Button
							onClick={handleScheduleClick}
							size='large'
							className='flex-1 border border-[#ff9900]! text-[#ff9900]! bg-white'>
							Schedule
						</Button>
						<Button
							type='primary'
							onClick={handleRunDraw}
							size='large'
							className='flex-1 bg-[#FF9900]! text-foreground! border-0'>
							Run draw
						</Button>
					</div>
				</div>
			</Modal>

			{/* Schedule Draw Modal */}
			<Modal
				title='Schedule draw'
				open={isScheduleModalOpen}
				onCancel={() => setIsScheduleModalOpen(false)}
				footer={null}
				width={500}>
				<div className='space-y-4 mt-6'>
					<div>
						<DatePicker
							value={newDraw.scheduleDate}
							onChange={(date) =>
								setNewDraw({ ...newDraw, scheduleDate: date })
							}
							size='large'
							className='w-full'
							format='MMMM YYYY'
							picker='month'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium  mb-2'>
							Select time
						</label>
						<Select
							placeholder='Select draw time'
							value={newDraw.scheduleTime || undefined}
							onChange={(value) =>
								setNewDraw({ ...newDraw, scheduleTime: value })
							}
							size='large'
							className='w-full'>
							<Option value='09:00 AM'>09:00 AM</Option>
							<Option value='10:00 AM'>10:00 AM</Option>
							<Option value='11:00 AM'>11:00 AM</Option>
							<Option value='12:00 PM'>12:00 PM</Option>
							<Option value='01:00 PM'>01:00 PM</Option>
							<Option value='02:00 PM'>02:00 PM</Option>
							<Option value='03:00 PM'>03:00 PM</Option>
							<Option value='04:00 PM'>04:00 PM</Option>
							<Option value='05:00 PM'>05:00 PM</Option>
						</Select>
					</div>

					<Button
						type='primary'
						onClick={handleSaveSchedule}
						size='large'
						className='w-full bg-[#FF9900] hover:bg-[#e68a00] border-0 mt-4'>
						Save
					</Button>
				</div>
			</Modal>
		</div>
	);
};

export default DrawManagement;
