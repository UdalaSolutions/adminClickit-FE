import { ChevronRight } from 'lucide-react';

export const SecurityItem = ({ label, value, onClick, status }) => (
	<button
		onClick={onClick}
		className='w-full flex items-center justify-between py-4 border-b border-[#F0F0F0] hover:bg-gray-50 transition-colors'>
		<span className='text-base font-medium text-[#1A1A1A]'>{label}</span>
		<div className='flex items-center gap-2'>
			{status && <span className='text-sm text-[#FF9500]'>{status}</span>}
			<ChevronRight className='w-5 h-5 text-[#CCCCCC]' />
		</div>
	</button>
);
