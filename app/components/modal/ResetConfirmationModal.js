import { Modal } from './GenericModal';

export const ResetConfirmationModal = ({ isOpen, onClose, onConfirm }) => (
	<Modal
		isOpen={isOpen}
		onClose={onClose}
		title='Security questions'
		maxWidth='max-w-md'>
		<div className='flex items-start gap-3 mb-6'>
			<div className='w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-1'>
				<span className='text-red-600 text-sm'>!</span>
			</div>
			<div>
				<p className='font-semibold text-[#1A1A1A] mb-1'>
					Forgot security questions?
				</p>
				<p className='text-sm text-[#666666]'>
					You&apos;re about to reset your security questions. Old questions and
					answers will be deactivated, and new ones will be required going
					forward.
				</p>
			</div>
		</div>
		<button
			onClick={onConfirm}
			className='w-full py-3 bg-[#FF9500] text-white rounded-xl font-medium hover:bg-[#E68600] transition-colors'>
			Reset
		</button>
	</Modal>
);
