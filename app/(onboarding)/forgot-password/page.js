'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleBack = () => {
		window.location.href = '/signup';
	};

	const handleSubmit = async () => {
		if (!email.trim()) return;

		setIsLoading(true);

		// Simulate sending reset email
		setTimeout(() => {
			setIsLoading(false);
			window.location.href = '/verify-email';
		}, 1000);
	};

	const isFormValid = email.trim() !== '';

	return (
		<div className='flex items-center justify-center p-4'>
			<div className='bg-white rounded-lg shadow-[0px_0px_4px_0px_#9CC6D31A] p-8 w-[500px]'>
				<button
					onClick={handleBack}
					className='bg-[#FAFAFA] rounded-xl flex items-center gap-2 text-foreground mb-6 h-12.5 w-12.5 justify-center cursor-pointer'>
					<ArrowLeft size={24} />
				</button>

				<h1 className='text-[32px] font-bold mb-2 text-center'>
					Forgot password
				</h1>
				<p className='text-[#999999] mb-8 text-center'>
					Enter your email address to reset your password
				</p>

				<div className='space-y-5'>
					<div>
						<label className='block font-medium text-[#999999] mb-2'>
							Email address
						</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder='e.g johnbrown2@gmail.com'
							className='w-full px-4 py-3 border border-foreground rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all'
						/>
					</div>

					<button
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
						className={`w-full py-3 rounded-xl bg-[#FAAA32] font-semibold transition-all mt-4 cursor-pointer
							${isFormValid && !isLoading ? '' : 'opacity-50 cursor-not-allowed'}`}>
						{isLoading ? 'Please wait...' : 'Continue'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
