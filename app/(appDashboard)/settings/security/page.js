'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { SecurityItem } from '../../../components/appDashboard/settings/securityItem';
import { ResetPasswordModal } from '../../../components/modal/resetPasswordModal';
import { SecurityQuestionsModal } from '../../../components/modal/SecurityQuestionsModal';
import { ResetConfirmationModal } from '../../../components/modal/ResetConfirmationModal';
import { SuccessModal } from '../../../components/modal/SuccessModal';

const SecuritySettingsPage = () => {
	const [showResetPassword, setShowResetPassword] = useState(false);
	const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showResetConfirmation, setShowResetConfirmation] = useState(false);
	const [securityQuestionsSet, setSecurityQuestionsSet] = useState(false);

	const handleSecurityQuestionsClose = () => {
		setShowSecurityQuestions(false);
		if (!securityQuestionsSet) {
			setSecurityQuestionsSet(true);
			setShowSuccess(true);
		}
	};

	const handleResetConfirm = () => {
		setShowResetConfirmation(false);
		setShowSecurityQuestions(true);
		setSecurityQuestionsSet(false);
	};

	return (
		<div className=''>
			<h1 className='border-[#E6E6E6] border-b p-6 font-bold text-xl text-[#1A1A1A]'>
				Security center
			</h1>

			<div className='max-w-[400px]  py-4'>
				<SecurityItem
					label='Password'
					onClick={() => setShowResetPassword(true)}
				/>
				<SecurityItem
					label='Security questions'
					status={securityQuestionsSet ? 'Reset' : 'Not set'}
					onClick={() =>
						securityQuestionsSet
							? setShowResetConfirmation(true)
							: setShowSecurityQuestions(true)
					}
				/>
				<SecurityItem
					label='Data backup'
					onClick={() => toast.info('Data backup is coming soon')}
				/>
				<SecurityItem
					label='Device management'
					onClick={() => toast.info('Device management is coming soon')}
				/>
			</div>

			<ResetPasswordModal
				isOpen={showResetPassword}
				onClose={() => setShowResetPassword(false)}
			/>
			<SecurityQuestionsModal
				isOpen={showSecurityQuestions}
				onClose={handleSecurityQuestionsClose}
			/>
			<SuccessModal
				isOpen={showSuccess}
				onClose={() => setShowSuccess(false)}
				message='Your security questions have been set and will be used to protect your account and prevent unauthorized access.'
			/>
			<ResetConfirmationModal
				isOpen={showResetConfirmation}
				onClose={() => setShowResetConfirmation(false)}
				onConfirm={handleResetConfirm}
			/>
		</div>
	);
};

export default SecuritySettingsPage;
