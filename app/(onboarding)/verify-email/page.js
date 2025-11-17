'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

const VerifyEmail = () => {
	const [code, setCode] = useState(['', '', '', '']);
	const [timer, setTimer] = useState(180); // 3 minutes in seconds
	const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

	// Countdown timer
	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	// Format timer as MM:SS
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	const handleChange = (index, value) => {
		// Only allow numbers
		if (value && !/^\d$/.test(value)) return;

		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);

		// Auto-focus next input
		if (value && index < 3) {
			inputRefs[index + 1].current?.focus();
		}
	};

	const handleKeyDown = (index, e) => {
		// Handle backspace
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs[index - 1].current?.focus();
		}
	};

	const handlePaste = (e) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').slice(0, 4);
		if (/^\d+$/.test(pastedData)) {
			const newCode = pastedData.split('');
			setCode([...newCode, '', '', ''].slice(0, 4));
			// Focus last filled input
			const lastIndex = Math.min(newCode.length, 3);
			inputRefs[lastIndex].current?.focus();
		}
	};

	const handleResend = () => {
		setTimer(180);
		setCode(['', '', '', '']);
		inputRefs[0].current?.focus();
		// Here you would call your resend API
		console.log('Resending code...');
	};

	const handleVerify = () => {
		const fullCode = code.join('');
		if (fullCode.length === 4) {
			// Here you would call your verification API
			console.log('Verifying code:', fullCode);
			window.location.href = '/confirm-password';
		}
	};

	const handleBack = () => {
		// Navigate back to signup
		window.location.href = '/forgot-password';
	};

	const isCodeComplete = code.every((digit) => digit !== '');

	return (
		<div className='flex items-center justify-center p-4'>
			<div className='bg-white rounded-lg shadow-[0px_0px_4px_0px_#9CC6D31A] p-8 min-w-[500px]'>
				<button
					onClick={handleBack}
					className='bg-[#FAFAFA] rounded-xl flex items-center gap-2 text-foreground mb-6 transition-colors h-12.5 w-12.5 justify-center cursor-pointer'>
					<ArrowLeft size={24} />
				</button>

				<h2 className='text-[32px] leading-12 font-bold  mb-2 text-center'>
					Verify your email
				</h2>
				<p className='text-[#999999] mb-8 text-center'>
					Enter the <span className='font-semibold'>4 digit code</span> sent to
					your email address{' '}
					<span className='font-semibold'>j****@gmail.com</span> below
				</p>

				<div className='flex gap-4 justify-center my-6 mt-10'>
					{code.map((digit, index) => (
						<input
							key={index}
							ref={inputRefs[index]}
							type='text'
							maxLength={1}
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							className='w-16 h-16 text-center text-2xl font-semibold bg-[#F5F5F5] rounded-lg focus:border-0 focus:ring-0 outline-none transition-all'
						/>
					))}
				</div>

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
					disabled={!isCodeComplete}
					className={`w-full py-3 rounded-xl font-semibold transition-colors cursor-pointer ${
						isCodeComplete
							? 'bg-[#FAAA32] '
							: 'bg-[#FAAA32]/50 text-foreground/50 cursor-not-allowed'
					}`}>
					Verify email
				</button>
			</div>
		</div>
	);
};

export default VerifyEmail;
