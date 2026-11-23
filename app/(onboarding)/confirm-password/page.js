'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '../../utils/api';

const ConfirmPassword = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	// Password validation checks
	const hasMinLength = formData.password.length >= 8;
	const hasUppercase = /[A-Z]/.test(formData.password);
	const hasNumber = /[0-9]/.test(formData.password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
	const passwordsMatch =
		formData.password === formData.confirmPassword &&
		formData.confirmPassword !== '';

	const isFormValid =
		formData.firstName.trim() !== '' &&
		formData.lastName.trim() !== '' &&
		formData.email.trim() !== '' &&
		hasMinLength &&
		hasUppercase &&
		hasNumber &&
		hasSpecialChar &&
		passwordsMatch;

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		if (error) setError('');
	};

	const handleSubmit = async () => {
		if (!isFormValid) return;
		setIsLoading(true);
		setError('');
		try {
			const email =
				typeof window !== 'undefined'
					? sessionStorage.getItem('pendingEmail') || formData.email
					: formData.email;
			await api.post('/api/user/reset-password', {
				email,
				newPassword: formData.password,
			});
			if (typeof window !== 'undefined') {
				sessionStorage.removeItem('pendingEmail');
			}
			window.location.href = '/signin';
		} catch (err) {
			setError(err.message || 'Failed to reset password. Please try again.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		// Navigate back to signup
		window.location.href = '/verify-email';
	};

	return (
		<div className='min-h-screen  flex items-center justify-center p-6'>
			<div className='bg-white rounded-lg shadow-[0px_0px_4px_0px_#9CC6D31A] p-6 sm:p-8 w-full max-w-[500px]'>
				<button
					onClick={handleBack}
					className='bg-[#FAFAFA] rounded-xl flex items-center gap-2 text-foreground mb-6 transition-colors h-12.5 w-12.5 justify-center cursor-pointer'>
					<ArrowLeft size={24} />
				</button>

				<h2 className='text-4xl leading-12 font-bold  text-center mb-2'>
					Create new password
				</h2>
				<p className='text-[#999999] mb-10 text-center'>
					Enter a new password to continue
				</p>

				<div className='space-y-4'>
					<div>
						<label className='block text-sm font-medium text-[#999999] mb-1'>
							New Password
						</label>
						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Enter your password'
								className='w-full px-4 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-[#FAAA32] focus:border-transparent outline-none pr-10'
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500/70 hover:text-[#999999]'>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-[#999999] mb-1'>
							Confirm password
						</label>
						<div className='relative'>
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder='Confirm your password'
								className='w-full px-4 py-2 border border-foreground rounded-lg focus:ring-2 focus:ring-[#FAAA32] focus:border-transparent outline-none pr-10'
							/>
							<button
								type='button'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500/70 hover:text-[#999999] '>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
					</div>

					<div className='grid grid-cols-1 min-[400px]:grid-cols-2 gap-x-8 gap-y-2 text-sm pt-2'>
						<div className='flex items-center gap-2'>
							<div
								className={`w-5 h-5 rounded-full flex items-center justify-center ${
									hasMinLength ? 'bg-[#FAAA32]' : 'bg-gray-300'
								}`}>
								<Check
									size={12}
									className={`${hasMinLength ? '' : 'text-foreground/80'}`}
								/>
							</div>
							<span
								className={hasMinLength ? 'text-[#FAAA32]' : 'text-[#999999]'}>
								8 character minimum
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<div
								className={`w-5 h-5 rounded-full flex items-center justify-center ${
									hasUppercase ? 'bg-[#FAAA32]' : 'bg-gray-300'
								}`}>
								<Check
									size={12}
									className={`${hasUppercase ? '' : 'text-foreground/80'}`}
								/>
							</div>
							<span
								className={hasUppercase ? 'text-[#FAAA32]' : 'text-[#999999]'}>
								One uppercase
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<div
								className={`w-5 h-5 rounded-full flex items-center justify-center ${
									hasNumber ? 'bg-[#FAAA32]' : 'bg-gray-300'
								}`}>
								<Check
									size={12}
									className={`${hasNumber ? '' : 'text-foreground/80'}`}
								/>
							</div>
							<span className={hasNumber ? 'text-[#FAAA32]' : 'text-[#999999]'}>
								One number
							</span>
						</div>
						<div className='flex items-center gap-2'>
							<div
								className={`w-5 h-5 rounded-full flex items-center justify-center ${
									hasSpecialChar ? 'bg-[#FAAA32]' : 'bg-gray-300'
								}`}>
								<Check
									size={12}
									className={`${hasSpecialChar ? '' : 'text-foreground/80'}`}
								/>
							</div>
							<span
								className={
									hasSpecialChar ? 'text-[#FAAA32]' : 'text-[#999999]'
								}>
								One special character
							</span>
						</div>
					</div>

					{error && (
						<div className='flex items-center gap-2 text-[#F20D0D]'>
							<AlertCircle size={16} />
							<span className='text-sm'>{error}</span>
						</div>
					)}

					<button
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
						className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mt-12 cursor-pointer ${
							isFormValid && !isLoading
								? 'bg-[#FAAA32]'
								: 'bg-[#FAAA32]/50 text-foreground/50 cursor-not-allowed'
						}`}>
						{isLoading ? 'Resetting...' : 'Reset Password'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmPassword;
