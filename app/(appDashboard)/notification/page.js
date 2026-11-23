'use client';

import { useState } from 'react';
import { Bell, Info, X } from 'lucide-react';
import { notifications as notificationsData } from '../../utils/utils';

const NotificationPage = () => {
	const [activeTab, setActiveTab] = useState('all');
	const [notificationList, setNotificationList] = useState(notificationsData);

	// Filter notifications based on active tab
	const filteredNotifications =
		activeTab === 'unread' ?
			notificationList.filter((n) => n.unread)
		:	notificationList;

	// Handle dismiss notification
	const handleDismiss = (index) => {
		setNotificationList(notificationList.filter((_, i) => i !== index));
	};

	return (
		<div className=''>
			{/* Content Card */}
			<div className='overflow-hidden'>
				{/* Tabs */}
				<div className='mb-6'>
					<div className='flex gap-4'>
						<button
							onClick={() => setActiveTab('all')}
							className={`h-6 px-3 transition-colors rounded-[50px] cursor-pointer ${
								activeTab === 'all' ?
									'text-[#FAAA32] bg-[#FFF7EB]'
								:	'bg-[#F0F0F0] text-[#999999]'
							}`}>
							All
						</button>
						<button
							onClick={() => setActiveTab('unread')}
							className={`h-6 px-3 rounded-[50px] transition-colors cursor-pointer ${
								activeTab === 'unread' ?
									' text-[#FAAA32] bg-[#FFF7EB]'
								:	'bg-[#F0F0F0] text-[#999999]'
							}`}>
							Unread
						</button>
					</div>
				</div>

				{/* Notifications List or Empty State */}
				{
					filteredNotifications.length === 0 ?
						// Empty State
						<div className='py-20 rounded-2xl items-center justify-center bg-white text-center min-h-screen flex'>
							<div>
								<h3 className='text-2xl font-bold  mb-2'>
									No notifications yet
								</h3>
								<p className='text-[#999999] text-center max-w-[343px]'>
									New updates and system alerts will appear here when available.
								</p>
							</div>
						</div>
						// Notifications List
					:	<div className='bg-white rounded-xl shadow-sm overflow-hidden'>
							<div className='divide-y divide-gray-100'>
								{filteredNotifications.map((notification, index) => (
									<div
										key={index}
										className={`px-6 py-5 transition-colors group ${
											notification.unread ?
												'bg-[#FFFBF5] hover:bg-[#FFF7EB]'
											:	'hover:bg-gray-50 '
										}`}>
										<div className='flex gap-4'>
											{/* Icon */}
											<div className='shrink-0'>
												<div
													className={`w-10 h-10 rounded-full flex items-center justify-center  ${
														notification.unread ?
															'bg-[#FFF7EB] text-[#faaa32]'
														:	' bg-[#F5F5F5] text-[#999999]'
													}`}>
													<Info className={`w-6 h-6`} />
												</div>
											</div>

											{/* Content */}
											<div className='flex-1 min-w-0'>
												<div className='flex items-start justify-between gap-4'>
													<div className='flex-1'>
														<p className='font-semibold text-[#3D3D3D] mb-2'>
															{notification.title}
														</p>
														<div className='flex items-center gap-2 text-sm text-[#999999]'>
															<span>{notification.time}</span>
														</div>
													</div>

													{/* Dismiss Button */}
													<button
														onClick={() => handleDismiss(index)}
														className='opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded'>
														<X className='w-6 h-6 text-[#999999]' />
													</button>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

				}
			</div>
		</div>
	);
};

export default NotificationPage;
