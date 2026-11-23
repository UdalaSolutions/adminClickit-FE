'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { api, sendOtp, validateOtp, login } from '../../utils/api';

const OTP_LENGTH = 6;
const emptyCode = () => Array(OTP_LENGTH).fill('');

const maskEmail = (email) => {
	if (!email) return 'your email';
	const [local, domain] = email.split('@');
	return `${local[0]}****@${domain}`;
};

const EmailVerification = () => {
	const [code, setCode] = useState(emptyCode());
	const [timer, setTimer] = useState(180);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState('');
	const inputRefs = useRef([]);

	const email =
		typeof window !== 'undefined'
			? sessionStorage.getItem('pendingEmail') || ''
			: '';

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handleChange = (index, value) => {
		if (value && !/^\d$/.test(value)) return;
		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);
		if (error) setError('');
		if (value && index < OTP_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').trim().slice(0, OTP_LENGTH);
		if (/^\d+$/.test(pastedData)) {
			const newCode = pastedData.split('');
			setCode([...newCode, ...emptyCode()].slice(0, OTP_LENGTH));
			const lastIndex = Math.min(newCode.length, OTP_LENGTH - 1);
			inputRefs.current[lastIndex]?.focus();
		}
	};

	const handleResend = async () => {
		try {
			await sendOtp(email);
		} catch (err) {
			setError(err.message || 'Failed to resend code');
			return;
		}
		setTimer(180);
		setCode(emptyCode());
		setError('');
		inputRefs.current[0]?.focus();
	};

	const handleVerify = async () => {
		const fullCode = code.join('');
		if (fullCode.length !== OTP_LENGTH) return;
		setIsVerifying(true);
		setError('');
		try {
			// Step 2: verify the code
			await validateOtp(email, fullCode);

			// Step 3: now create the account, then log in to get a token
			const pending = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null');
			if (!pending) throw new Error('Signup details missing. Please sign up again.');
			await api.post('/api/user/register', pending);
			await login(pending.email, pending.password, pending);

			sessionStorage.removeItem('pendingEmail');
			sessionStorage.removeItem('pendingSignup');
			window.location.href = '/dashboard';
		} catch (err) {
			setError(err.message || 'Invalid code. Please try again.');
		} finally {
			setIsVerifying(false);
		}
	};

	const handleBack = () => {
		window.location.href = '/signup';
	};

	const isCodeComplete = code.every((digit) => digit !== '');

	return (
		<div className='flex items-center justify-center p-4'>
			<div className='bg-white rounded-lg shadow-[0px_0px_4px_0px_#9CC6D31A] p-6 sm:p-8 w-full max-w-[500px]'>
				<button
					onClick={handleBack}
					className='bg-[#FAFAFA] rounded-xl flex items-center gap-2 text-foreground mb-6 transition-colors h-12.5 w-12.5 justify-center cursor-pointer'>
					<ArrowLeft size={24} />
				</button>

				<h2 className='text-[32px] leading-12 font-bold  mb-2 text-center'>
					Verify your email
				</h2>
				<p className='text-[#999999] mb-8 text-center'>
					Enter the <span className='font-semibold'>{OTP_LENGTH} digit code</span> sent to
					your email address{' '}
					<span className='font-semibold'>{maskEmail(email)}</span> below
				</p>

				<div className='flex gap-2 sm:gap-3 justify-center my-6 mt-10'>
					{code.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							inputMode='numeric'
							type='text'
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							className='w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-semibold bg-[#F5F5F5] rounded-lg focus:border-0 focus:ring-0 outline-none transition-all'
						/>
					))}
				</div>

				{error && (
					<div className='flex items-center gap-2 text-[#F20D0D] mb-3 justify-center'>
						<AlertCircle size={16} />
						<span className='text-sm'>{error}</span>
					</div>
				)}

				<p className='text-center text-gray-600 mb-4'>
					Code expires in{' '}
					<span className='font-semibold '>{formatTime(timer)}s</span>
				</p>

				<div className='text-center mb-6'>
					<span className='text-gray-600'>Didn&apos;t get code? </span>
					<button
						onClick={handleResend}
						disabled={timer > 0}
						className={`font-semibold ${
							timer > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-[#FAAA32]'
						}`}>
						Resend code
					</button>
				</div>

				<button
					onClick={handleVerify}
					disabled={!isCodeComplete || isVerifying}
					className={`w-full py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
						isCodeComplete && !isVerifying
							? 'bg-[#FAAA32] '
							: 'bg-[#FAAA32]/50 text-foreground/50 cursor-not-allowed'
					}`}>
					{isVerifying ? 'Verifying...' : 'Verify email'}
				</button>
			</div>
		</div>
	);
};

export default EmailVerification;
