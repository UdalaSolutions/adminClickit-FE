'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { menuItems } from '../../utils/utils';

const Sidebar = () => {
	const pathname = usePathname();

	return (
		<aside className='w-[300px] h-screen bg-white flex flex-col fixed top-0 left-0 z-20'>
			{/* Logo Section */}
			<div className='p-5 px-6 '>
				<Image
					src='/appDashboard/clickit-logo.svg'
					alt='logo'
					width={163}
					height={50}
				/>
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
	);
};

export default Sidebar;
