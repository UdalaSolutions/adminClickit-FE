'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';

const NotificationsSettingsPage = () => {
	const [notifications, setNotifications] = useState({
		securityAlerts: true,
		drawReminders: true,
		emailNotification: true,
	});

	const handleToggle = (key) => {
		setNotifications((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};

	const handleSave = () => {
		try {
			// your API call here
			// await updateNotificationSettings(notifications);

			toast.success('Notification settings updated successfully!');
		} catch (error) {
			toast.error('Failed to update settings. Please try again.');
		}
	};

	const notificationItems = [
		{
			key: 'securityAlerts',
			label: 'Security alerts',
			enabled: notifications.securityAlerts,
		},
		{
			key: 'drawReminders',
			label: 'Draw reminders',
			enabled: notifications.drawReminders,
		},
		{
			key: 'emailNotification',
			label: 'Email notification',
			enabled: notifications.emailNotification,
		},
	];

	return (
		<div>
			<h1 className='border-[#E6E6E6] border-b p-3 font-bold text-xl leading-7.5 text-[#1A1A1A]'>
				Notifications
			</h1>

			<div className='py-6'>
				<div className='flex flex-col gap-8 max-w-[420px]'>
					{/* Notification Items */}
					{notificationItems.map((item) => (
						<div
							key={item.key}
							className='flex items-center justify-between bg-[#FCFCFC] rounded-xl px-3 py-4'>
							<span className='text-base font-normal text-[#1A1A1A]'>
								{item.label}
							</span>

							{/* Toggle Switch */}
							<button
								onClick={() => handleToggle(item.key)}
								className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
									item.enabled
										? 'bg-white border-[#1a1a1a] border'
										: 'bg-gray-300'
								}`}
								role='switch'
								aria-checked={item.enabled}>
								<span
									className={`inline-block h-6 w-6 transform rounded-full  transition-transform ${
										item.enabled
											? 'translate-x-7 bg-[#1a1a1a]'
											: 'translate-x-1 bg-white'
									}`}
								/>
							</button>
						</div>
					))}

					{/* Save Button */}
					<div className='flex justify-end pt-4'>
						<button
							onClick={handleSave}
							className='px-6 py-3 bg-[#FAAA32] text-foreground rounded-xl font-semibold hover:bg-[#e99a22] transition-colors'>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotificationsSettingsPage;
