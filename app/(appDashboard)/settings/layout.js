'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { settingsModules } from '../../utils/utils';

const SettingsLayout = ({ children }) => {
	const pathname = usePathname();

	return (
		<div className='bg-white shadow-[#9CC6D31A] rounded-xl p-6 flex gap-10'>
			{/* left */}
			<aside className='border-r border-[#E0E0E0] h-auto flex flex-col gap-4 max-w-[300px] p-6 pl-1 pr-8'>
				{settingsModules.map((module) => {
					const Icon = module.icon;
					const isActive = pathname === module.href;

					return (
						<Link
							key={module.id}
							href={module.href}
							className={`flex items-center gap-3 p-3 rounded-lg font-semibold cursor-pointer transition-colors ${
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
			<div className='flex-1 p-2 pl-0'>{children}</div>
		</div>
	);
};

export default SettingsLayout;
