'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from './GenericModal';
import { Input } from '../forms/input';

export const SecurityQuestionsModal = ({ isOpen, onClose }) => {
	const [step, setStep] = useState(1);
	const [question1, setQuestion1] = useState('');
	const [answer1, setAnswer1] = useState('');
	const [question2, setQuestion2] = useState('');
	const [answer2, setAnswer2] = useState('');
	const [verificationCode, setVerificationCode] = useState(['', '', '', '']);

	const questions = [
		"What's your mother's maiden name?",
		"What's your primary school name?",
		"What's your favorite color?",
		"What's your pet's name?",
	];

	const handleCodeChange = (index, value) => {
		if (value.length <= 1 && /^\d*$/.test(value)) {
			const newCode = [...verificationCode];
			newCode[index] = value;
			setVerificationCode(newCode);

			if (value && index < 3) {
				document.getElementById(`code-${index + 1}`)?.focus();
			}
		}
	};

	const handleNext = () => {
		if (step === 1 && question1 && answer1 && question2 && answer2) {
			setStep(2);
		} else if (step === 2) {
			toast.success('Security questions set successfully!');
			onClose();
			setStep(1);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title='Security questions'
			maxWidth='max-w-lg'>
			{step === 1 ? (
				<>
					<div className='mb-4'>
						<label className='block text-sm text-[#666666] mb-2'>
							Question 1
						</label>
						<select
							value={question1}
							onChange={(e) => setQuestion1(e.target.value)}
							className='w-full px-4 py-3 border border-[#E6E6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200'>
							<option value=''>Select question 1</option>
							{questions.map((q, i) => (
								<option
									key={i}
									value={q}>
									{q}
								</option>
							))}
						</select>
					</div>
					<Input
						label='Answer'
						value={answer1}
						onChange={(e) => setAnswer1(e.target.value)}
						placeholder='Write your answer here'
					/>
					<div className='mb-4'>
						<label className='block text-sm text-[#666666] mb-2'>
							Question 2
						</label>
						<select
							value={question2}
							onChange={(e) => setQuestion2(e.target.value)}
							className='w-full px-4 py-3 border border-[#E6E6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200'>
							<option value=''>Select question 2</option>
							{questions.map((q, i) => (
								<option
									key={i}
									value={q}>
									{q}
								</option>
							))}
						</select>
					</div>
					<Input
						label='Answer'
						value={answer2}
						onChange={(e) => setAnswer2(e.target.value)}
						placeholder='Write your answer here'
					/>
				</>
			) : (
				<>
					<div className='text-center mb-6'>
						<p className='text-[#666666] mb-1'>
							Enter the <span className='font-semibold'>4 digit code</span> sent
							to your email address
						</p>
						<p className='text-[#1A1A1A] font-medium'>
							j*****@gmail.com <span className='text-[#666666]'>below</span>
						</p>
					</div>
					<div className='flex gap-3 justify-center mb-4'>
						{verificationCode.map((digit, index) => (
							<input
								key={index}
								id={`code-${index}`}
								type='text'
								maxLength={1}
								value={digit}
								onChange={(e) => handleCodeChange(index, e.target.value)}
								className='w-14 h-14 text-center text-2xl border border-[#E6E6E6] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200'
							/>
						))}
					</div>
					<p className='text-center text-sm text-[#666666] mb-6'>
						Code expires in <span className='font-semibold'>3:15s</span>
					</p>
					<div className='text-center mb-6'>
						<span className='text-sm text-[#666666]'>
							Didn&apos;t get code?{' '}
						</span>
						<button className='text-sm text-[#FF9500] font-medium'>
							Resend code
						</button>
					</div>
				</>
			)}
			<button
				onClick={handleNext}
				disabled={
					step === 1
						? !question1 || !answer1 || !question2 || !answer2
						: verificationCode.some((d) => !d)
				}
				className='w-full py-3 bg-[#FF9500] text-white rounded-xl font-medium hover:bg-[#E68600] transition-colors disabled:bg-[#FFE5CC] disabled:cursor-not-allowed'>
				{step === 1 ? 'Next' : 'Verify email'}
			</button>
		</Modal>
	);
};
