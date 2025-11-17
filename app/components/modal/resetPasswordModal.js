'use client';

import { useState } from 'react';
import { PasswordRequirements } from '../appDashboard/settings/passwordRequirement';
import { Input } from '../forms/input';
import { Modal } from './GenericModal';

export const ResetPasswordModal = ({ isOpen, onClose }) => {
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	const handleSubmit = () => {
		if (newPassword === confirmPassword && newPassword.length >= 8) {
			alert('Password reset successful!');
			onClose();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Reset password'
			maxWidth='max-w-lg'>
			<Input
				label='Current password'
				value={currentPassword}
				onChange={(e) => setCurrentPassword(e.target.value)}
				placeholder='Enter current password'
				showToggle
				showPassword={showCurrent}
				onToggle={() => setShowCurrent(!showCurrent)}
			/>
			<Input
				label='New password'
				value={newPassword}
				onChange={(e) => setNewPassword(e.target.value)}
				placeholder='Enter new password'
				showToggle
				showPassword={showNew}
				onToggle={() => setShowNew(!showNew)}
			/>
			<Input
				label='Confirm new password'
				value={confirmPassword}
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder='Confirm your password'
				showToggle
				showPassword={showConfirm}
				onToggle={() => setShowConfirm(!showConfirm)}
			/>
			<PasswordRequirements password={newPassword} />
			<button
				onClick={handleSubmit}
				disabled={
					!currentPassword ||
					!newPassword ||
					!confirmPassword ||
					newPassword !== confirmPassword
				}
				className='w-full py-3 bg-[#FF9500] text-white rounded-xl font-medium hover:bg-[#E68600] transition-colors disabled:bg-[#FFE5CC] disabled:cursor-not-allowed'>
				Confirm
			</button>
		</Modal>
	);
};
