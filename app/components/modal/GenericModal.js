import { X } from 'lucide-react';

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	maxWidth = 'max-w-md',
}) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 bg-opacity-50'>
			<div
				className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide`}>
				{/* Header */}
				<div className='flex items-center justify-between p-6 pb-2'>
					<h2 className='text-2xl/9 font-bold text-[#1A1A1A]'>{title}</h2>
					<button
						onClick={onClose}
						className='bg-[#F7F7F7] rounded-xl text-foreground h-10 w-10 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors'>
						<X className='w-6 h-6' />
					</button>
				</div>

				{/* Body */}
				<div className='p-6'>{children}</div>

				{/* Footer (optional) */}
				{footer && <div className='p-6 pt-0'>{footer}</div>}
			</div>
		</div>
	);
};
