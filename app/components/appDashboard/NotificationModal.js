import { Info } from 'lucide-react';
import Link from 'next/link';

const NotificationModal = ({ isOpen, onClose, notifications }) => {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className='fixed inset-0 z-40'
				onClick={onClose}
			/>

			{/* Modal */}
			<div
				className='absolute top-[70px] right-0 w-[500px] bg-white rounded-xl shadow-[0px_0px_22px_10px_#9CC6D34D]
 z-50 overflow-hidden'>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
					<h3 className='text-lg font-bold leading-7'>Notifications</h3>
					<Link
						href='/notification'
						className='text-sm text-[#FAAA32] hover:text-[#e99820] transition-colors cursor-pointer'>
						See all
					</Link>
				</div>

				{/* Content */}
				<div className='max-h-[400px] overflow-y-auto'>
					{notifications.length === 0 ? (
						<div className='py-16 px-6 text-center flex flex-col items-center'>
							<p className='text-gray-500 font-medium mb-2'>
								No notifications yet
							</p>
							<p className='text-sm text-[#999999] max-w-[287px] text-center'>
								New updates and system alerts will appear here when available.
							</p>
						</div>
					) : (
						<div className=''>
							{notifications.slice(0, 4).map((notification, index) => (
								<div
									key={index}
									className={`px-6 py-4  transition-colors cursor-pointer border-b border-[#E0E0E0] last:border-b-0 ${
										notification.unread
											? 'bg-[#FFFBF5] hover:bg-[#FFF7EB]'
											: 'hover:bg-gray-50'
									}`}>
									<div className='flex gap-3'>
										{/* Icon */}
										<div
											className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
												notification.unread ? 'bg-[#FFF7EB]' : 'bg-[#F5F5F5]'
											}`}>
											<Info
												className={`w-6 h-6  ${
													notification.unread
														? 'text-[#faaa32]'
														: 'text-[#c2c2c2]'
												}`}
											/>
										</div>

										{/* Content */}
										<div className='flex-1 min-w-0'>
											<p className='text-sm font-semibold mb-1 text-subText'>
												{notification.title}
											</p>
											<div className='flex items-center gap-2 text-xs text-[#c2c2c2]'>
												<span>{notification.time}</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default NotificationModal;
