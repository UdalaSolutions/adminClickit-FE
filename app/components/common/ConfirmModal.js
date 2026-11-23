'use client';

import { Modal } from 'antd';

// In-app replacement for window.confirm, styled with the app's brand colours
export default function ConfirmModal({
	open,
	title = 'Are you sure?',
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	loading = false,
	onConfirm,
	onCancel,
}) {
	return (
		<Modal
			open={open}
			onCancel={loading ? undefined : onCancel}
			footer={null}
			closable={!loading}
			maskClosable={!loading}
			centered
			width={420}>
			<div className='pt-2'>
				<h3 className='text-xl font-bold text-[#1A1A1A] mb-2'>{title}</h3>
				{message && <p className='text-[#999999] mb-6'>{message}</p>}

				<div className='flex gap-3 w-full'>
					<button
						type='button'
						onClick={onCancel}
						disabled={loading}
						className='flex-1 py-3 rounded-xl font-semibold border border-[#FAAA32] text-[#FAAA32] bg-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'>
						{cancelText}
					</button>
					<button
						type='button'
						onClick={onConfirm}
						disabled={loading}
						className='flex-1 py-3 rounded-xl font-bold bg-[#FAAA32] text-[#1A1A1A] transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
						{loading ? 'Please wait...' : confirmText}
					</button>
				</div>
			</div>
		</Modal>
	);
}
