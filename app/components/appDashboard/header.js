'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Dropdown } from 'antd';
import { Bell, ChevronDown, Menu, LogOut, User } from 'lucide-react';
import { useSidebar } from './shell';
import NotificationModal from '../../components/appDashboard/NotificationModal';
import { notifications } from '../../utils/utils';
import { getCurrentUser, displayName, logout } from '../../utils/api';

const formatRole = (role) =>
	(role || 'ADMIN')
		.toLowerCase()
		.split('_')
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(' ');

const Header = () => {
	const [showNotifications, setShowNotifications] = useState(false);
	const [user, setUser] = useState(null);
	const pathname = usePathname();
	const { setOpen } = useSidebar();

	// Read after mount so server and client render the same markup
	useEffect(() => {
		const sync = () => setUser(getCurrentUser());
		sync();
		// Profile page fires this after saving
		window.addEventListener('user-updated', sync);
		return () => window.removeEventListener('user-updated', sync);
	}, []);

	const { name, initials } = displayName(user);
	const router = useRouter();

	const accountMenu = {
		items: [
			{
				key: 'who',
				disabled: true,
				label: (
					<div className='py-1 max-w-[220px]'>
						<div className='font-semibold text-[#1A1A1A] truncate'>{name}</div>
						<div className='text-xs text-[#999999] truncate'>
							{user?.email || formatRole(user?.role)}
						</div>
					</div>
				),
			},
			{ type: 'divider' },
			{
				key: 'profile',
				icon: <User size={16} />,
				label: <span className='text-sm'>Profile settings</span>,
			},
			{
				key: 'logout',
				icon: <LogOut size={16} />,
				label: <span className='text-sm'>Sign out</span>,
			},
		],
		onClick: ({ key }) => {
			if (key === 'profile') router.push('/settings/profile');
			if (key === 'logout') {
				logout();
				window.location.href = '/signin';
			}
		},
	};

	const unreadCount = notifications.filter((n) => n.unread).length;

	// Get page title from pathname
	const getPageTitle = () => {
		const segments = pathname.split('/').filter(Boolean);
		const main = segments[0] || 'dashboard';

		return main
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	return (
		<header className='flex justify-between items-center gap-3 px-4 sm:px-6 py-4 border-b-[0.5px] border-[#E0E0E0] fixed top-0 right-0 left-0 lg:left-[260px] xl:left-[300px] z-30 bg-white'>
			<div className='flex items-center gap-2 min-w-0'>
				<button
					onClick={() => setOpen(true)}
					className='lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100'
					aria-label='Open menu'>
					<Menu size={24} />
				</button>
				<h1 className='font-bold text-xl sm:text-2xl leading-9 truncate'>
					{getPageTitle()}
				</h1>
			</div>

			<div className='flex items-center gap-3 sm:gap-6 shrink-0'>
				{/* Notification Bell */}
				<div className='relative'>
					<button
						onClick={() => setShowNotifications(!showNotifications)}
						className='h-10 w-10 sm:h-[50px] sm:w-[50px] rounded-[50px] flex items-center justify-center gap-2 bg-[#FFF7EB] cursor-pointer hover:bg-[#FFE8C5] transition-colors relative'>
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

				{/* Admin Info — click to open account menu */}
				<Dropdown menu={accountMenu} trigger={['click']} placement='bottomRight'>
				<button
					type='button'
					className='flex items-center gap-3 text-left cursor-pointer rounded-xl p-1 -m-1 hover:bg-gray-50'
					aria-label='Account menu'>
					{/* Initials avatar */}
					<div
						className='h-10 w-10 sm:h-[50px] sm:w-[50px] rounded-full bg-[#FAAA32] text-white font-bold sm:text-lg flex items-center justify-center select-none overflow-hidden'
						title={user?.email || ''}>
						{user?.profileImage ? (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={user.profileImage}
								alt=''
								className='w-full h-full object-cover'
							/>
						) : (
							initials
						)}
					</div>
					{/* Avatar Info */}
					<div className='hidden sm:block'>
						<h1 className='font-bold'>{name}</h1>
						<div className='flex items-center gap-1.5 text-[#999999] text-sm'>
							<div className='h-3.5 w-3.5 bg-[#049A04] rounded-[50px]' />
							{formatRole(user?.role)}
						</div>
					</div>

					{/* Arrow Down */}
					<ChevronDown className='h-5 w-5 text-[#999999] hidden sm:block' />
				</button>
				</Dropdown>
			</div>
		</header>
	);
};

export default Header;
