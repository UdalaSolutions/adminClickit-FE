'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { menuItems } from '../../utils/utils';
import { useSidebar } from './shell';

const Sidebar = () => {
	const pathname = usePathname();
	const { open, setOpen } = useSidebar();

	return (
		<>
		{/* Dim background when the drawer is open on small screens */}
		{open && (
			<div
				className='fixed inset-0 bg-black/30 z-40 lg:hidden'
				onClick={() => setOpen(false)}
			/>
		)}
		<aside
			className={`w-[260px] xl:w-[300px] h-screen bg-white flex flex-col fixed top-0 left-0 z-50 lg:z-20 transition-transform duration-200 ${
				open ? 'translate-x-0 shadow-xl' : '-translate-x-full'
			} lg:translate-x-0 lg:shadow-none`}>
			{/* Logo Section */}
			<div className='p-5 px-6 flex items-center justify-between'>
				<Image
					src='/appDashboard/clickit-logo.svg'
					alt='logo'
					width={163}
					height={50}
				/>
				<button
					onClick={() => setOpen(false)}
					className='lg:hidden p-2 rounded-lg hover:bg-gray-100'
					aria-label='Close menu'>
					<X size={22} />
				</button>
			</div>

			{/* Menu Items */}
			<nav className='flex-1 p-4 px-6 space-y-2!'>
				{menuItems.map((item) => {
					const Icon = item.icon;

					// Active if pathname starts with the item's path
					const isActive = pathname.startsWith(item.path);

					return (
						<Link
							key={item.label}
							href={item.path}
							onClick={() => setOpen(false)}
							className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all cursor-pointer ${
								isActive
									? 'bg-[#FFF7EB] border-l-4 border-[#FAAA32] rounded-md font-bold text-[17px]'
									: 'hover:bg-gray-50'
							}`}>
							<Icon
								size={24}
								className={isActive ? 'font-bold' : ''}
							/>
							<span
								className={`text-sm font-medium ${
									isActive ? 'font-semibold' : ''
								}`}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</nav>
		</aside>
		</>
	);
};

export default Sidebar;
