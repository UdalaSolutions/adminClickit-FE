'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { settingsModules } from '../../utils/utils';

const SettingsLayout = ({ children }) => {
	const pathname = usePathname();

	return (
		<div className='bg-white shadow-[#9CC6D31A] rounded-xl p-4 sm:p-6 flex flex-col md:flex-row gap-4 md:gap-10'>
			{/* left */}
			<aside className='border-b md:border-b-0 md:border-r border-[#E0E0E0] h-auto flex md:flex-col gap-2 md:gap-4 overflow-x-auto md:overflow-visible pb-3 md:pb-6 md:max-w-[300px] md:p-6 md:pl-1 md:pr-8 shrink-0'>
				{settingsModules.map((module) => {
					const Icon = module.icon;
					const isActive = pathname === module.href;

					return (
						<Link
							key={module.id}
							href={module.href}
							className={`flex items-center gap-3 p-3 rounded-lg font-semibold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
								isActive
									? 'bg-[#FFF7EB] text-[#FAAA32]'
									: 'hover:bg-gray-50 text-gray-700'
							}`}>
							<Icon className={`h-6 w-6 ${isActive ? 'text-[#FAAA32]' : ''}`} />
							{module.label}
						</Link>
					);
				})}
			</aside>

			{/* right */}
			<div className='flex-1 min-w-0 md:p-2 md:pl-0'>{children}</div>
		</div>
	);
};

export default SettingsLayout;
