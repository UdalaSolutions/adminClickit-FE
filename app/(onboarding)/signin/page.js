'use client';

import { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { login } from '../../utils/api';

const Signin = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		if (error) setError('');
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		setError('');
		try {
			await login(formData.email.trim(), formData.password);
			window.location.href = '/dashboard';
		} catch (err) {
			setError(err.message || 'Invalid credentials');
		} finally {
			setIsLoading(false);
		}
	};

	const handleForgotPassword = () => {
		// Navigate to forgot password page
		window.location.href = '/forgot-password';
	};

	const isFormValid =
		formData.email.trim() !== '' && formData.password.trim() !== '';

	return (
		<div className='w-full flex items-center justify-center p-4'>
			<div className='bg-white rounded-lg shadow-[0px_0px_4px_0px_#9CC6D31A] p-6 sm:p-10 w-full max-w-[540px] '>
				<h1 className='text-[32px] font-bold  mb-2 text-center'>
					Welcome Admin
				</h1>
				<p className='text-[#999999] mb-8 text-center'>
					Enter your details to log in to your account
				</p>

				<div className='space-y-5'>
					<div>
						<label className='block font-medium text-[#999999] mb-2'>
							Email address
						</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							placeholder='e.g johnbrown2@gmail.com'
							className='w-full px-4 py-3 border border-foreground rounded-lg focus:ring-2 focus:border-transparent outline-none transition-all'
						/>
					</div>

					<div>
						<label className='block font-medium text-[#999999] mb-2'>
							Password
						</label>
						<div className='relative'>
							<input
								type={showPassword ? 'text' : 'password'}
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='Enter your password here'
								className={`w-full px-4 py-3 border rounded-lg focus:ring-2  focus:border-transparent outline-none pr-10 transition-all border-foreground `}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#999999]'>
								{showPassword ?
									<EyeOff size={20} />
								:	<Eye size={20} />}
							</button>
						</div>

						{error && (
							<div className='flex items-center gap-2 mt-2 text-[#F20D0D]'>
								<AlertCircle size={16} />
								<span>{error}</span>
							</div>
						)}
					</div>

					<div className='flex justify-end'>
						<button
							type='button'
							onClick={handleForgotPassword}
							className='text-amber-500 hover:text-amber-600 font-medium text-sm transition-colors'>
							Forgot password?
						</button>
					</div>

					<button
						onClick={handleSubmit}
						disabled={!isFormValid || isLoading}
						className={`w-full py-3 rounded-xl bg-[#FAAA32] font-semibold transition-all cursor-pointer ${
							isFormValid && !isLoading ? '' : ' cursor-not-allowed'
						}`}>
						{isLoading ? 'Logging in...' : 'Log in'}
					</button>

					<p className='text-center text-[#999999] mt-4'>
						Don&apos;t have an account?{' '}
						<a
							href='/signup'
							className='text-[#FAAA32] font-semibold hover:underline'>
							Sign up
						</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Signin;
