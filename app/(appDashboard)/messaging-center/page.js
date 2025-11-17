'use client';

import { Info, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Messaging = () => {
	const [formData, setFormData] = useState({
		senderId: '',
		messageType: '',
		recipient: '',
		message: '',
	});

	const messageTypes = [
		{ value: '', label: 'Select message type' },
		{ value: 'promotional', label: 'Promotional' },
		{ value: 'transactional', label: 'Transactional' },
		{ value: 'notification', label: 'Notification' },
		{ value: 'alert', label: 'Alert' },
	];

	const recipients = [
		{ value: '', label: 'Select the recipient for this broadcast' },
		{ value: 'all_users', label: 'All Users' },
		{ value: 'active_users', label: 'Active Users' },
		{ value: 'inactive_users', label: 'Inactive Users' },
		{ value: 'premium_users', label: 'Premium Users' },
		{ value: 'custom_group', label: 'Custom Group' },
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('Form submitted:', formData);
	};

	const handleSchedule = (e) => {
		e.preventDefault();
		console.log('Message scheduled:', formData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const messageLength = formData.message.length;
	const maxChars = 160;

	return (
		<form
			className='p-6 bg-white rounded-xl flex flex-col gap-10 max-w-[500px]'
			onSubmit={handleSubmit}>
			<h1>Create message</h1>

			<div className='flex flex-col gap-6'>
				<div className='text-secondaryGray'>
					<label htmlFor='senderId'>Sender ID</label>
					<input
						id='senderId'
						name='senderId'
						type='text'
						value={formData.senderId}
						onChange={handleChange}
						className='w-full border border-secondaryGray! rounded-xl px-3 py-2 mt-2.5 outline-none h-12.5'
						placeholder='Enter your ID here'
						required
					/>
				</div>

				<div className='text-secondaryGray'>
					<label htmlFor='messageType'>Message type</label>
					<div className='relative mt-2.5'>
						<select
							id='messageType'
							name='messageType'
							value={formData.messageType}
							onChange={handleChange}
							className='w-full border border-secondaryGray rounded-xl px-3 py-2 outline-none h-12.5 appearance-none bg-white pr-10'
							required>
							{messageTypes.map((type) => (
								<option
									key={type.value}
									value={type.value}>
									{type.label}
								</option>
							))}
						</select>
						<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondaryGray pointer-events-none' />
					</div>
				</div>

				<div className='text-secondaryGray'>
					<label htmlFor='recipient'>Recipient</label>
					<div className='relative mt-2.5'>
						<select
							id='recipient'
							name='recipient'
							value={formData.recipient}
							onChange={handleChange}
							className='w-full border border-secondaryGray rounded-xl px-3 py-2 outline-none h-12.5 appearance-none bg-white pr-10'
							required>
							{recipients.map((recipient) => (
								<option
									key={recipient.value}
									value={recipient.value}>
									{recipient.label}
								</option>
							))}
						</select>
						<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondaryGray pointer-events-none' />
					</div>
				</div>

				<div className='text-secondaryGray'>
					<label htmlFor='message'>Message</label>
					<textarea
						id='message'
						name='message'
						value={formData.message}
						onChange={handleChange}
						className='w-full border border-secondaryGray rounded-xl px-3 py-2 mt-2.5 outline-none resize-none h-32'
						placeholder='Enter your message here...'
						maxLength={maxChars}
						required
					/>
					<div className='flex items-center justify-end gap-2 mt-2 text-[#049A04]'>
						<Info className='h-5 w-5' />
						<span className='text-sm'>
							{messageLength}/{maxChars} characters
						</span>
					</div>
				</div>
			</div>

			<div className='flex items-center justify-end gap-6'>
				<button
					type='button'
					onClick={handleSchedule}
					className='bg-white border-[#faaa32] text-[#faaa32] rounded-xl border flex items-center justify-center gap-2 px-7 py-2.5 cursor-pointer font-bold'>
					Schedule
				</button>
				<button
					type='submit'
					className='bg-[#faaa32]! border-[#faaa32] text-foreground rounded-xl border flex items-center justify-center gap-2 px-7 py-2.5 cursor-pointer font-bold'>
					Send
				</button>
			</div>
		</form>
	);
};

export default Messaging;
