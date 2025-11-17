import { Modal } from './GenericModal';

export const SuccessModal = ({ isOpen, onClose, message }) => (
	<Modal
		isOpen={isOpen}
		onClose={onClose}
		title='Setup complete!'
		maxWidth='max-w-md'>
		<p className='text-[#666666] mb-6 text-center'>{message}</p>
		<button
			onClick={onClose}
			className='w-full py-3 bg-[#FF9500] text-white rounded-xl font-medium hover:bg-[#E68600] transition-colors'>
			Dismiss
		</button>
	</Modal>
);
