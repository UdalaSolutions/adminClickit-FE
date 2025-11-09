'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Bell, ChevronDown } from 'lucide-react';
import NotificationModal from '@/app/components/(appDashboard)/NotificationModal';
import { notifications } from '@/app/utils/utils';

const Header = () => {
	const [showNotifications, setShowNotifications] = useState(false);
	const pathname = usePathname();

	const unreadCount = notifications.filter((n) => n.unread).length;

	// Get page title from pathname
	const getPageTitle = () => {
		const path = pathname.split('/').pop() || 'dashboard';
		return path
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	return (
		<header className='flex justify-between items-center p-6 py-4 border-b-[0.5px] border-[#E0E0E0] fixed top-0 right-0 left-[300px] z-30 bg-white'>
			<h1 className='font-bold text-2xl leading-9'>{getPageTitle()}</h1>

			<div className='flex items-center gap-6'>
				{/* Notification Bell */}
				<div className='relative'>
					<button
						onClick={() => setShowNotifications(!showNotifications)}
						className='h-[50px] w-[50px] rounded-[50px] flex items-center justify-center gap-2 bg-[#FFF7EB] cursor-pointer hover:bg-[#FFE8C5] transition-colors relative'>
						<Bell className='text-[#faaa32] w-5 h-5' />
						{unreadCount > 0 && (
							<div className='absolute top-0 right-2 w-2.5 h-2.5 bg-[#F20D0D] rounded-full! flex items-center justify-center'></div>
						)}
					</button>

					{/* Notification Modal */}
					<NotificationModal
						isOpen={showNotifications}
						onClose={() => setShowNotifications(false)}
						notifications={notifications}
					/>
				</div>

				{/* Admin Info */}
				<div className='flex items-center gap-3'>
					{/* Avatar Image */}
					<Image
						src='/appDashboard/avatar_image.svg'
						alt='avatar'
						className='rounded-full'
						height={50}
						width={50}
					/>
					{/* Avatar Info */}
					<div>
						<h1 className='font-bold'>John Doe</h1>
						<div className='flex items-center gap-1.5 text-[#999999] text-sm'>
							<div className='h-3.5 w-3.5 bg-[#049A04] rounded-[50px]' />
							Admin
						</div>
					</div>

					{/* Arrow Down */}
					<div>
						<ChevronDown className='h-5 w-5 text-[#999999]' />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
