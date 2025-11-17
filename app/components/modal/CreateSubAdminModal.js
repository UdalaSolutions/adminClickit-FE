import { X, Eye, EyeOff, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

const CreateSubAdminModal = ({
	isOpen,
	onClose,
	onSubmit,
	initialData = null,
}) => {
	const getInitialFormData = () => {
		if (initialData) {
			return {
				firstName: initialData.firstName || '',
				lastName: initialData.lastName || '',
				email: initialData.email || '',
				adminRole: initialData.adminRole || '',
				password: '',
				confirmPassword: '',
			};
		}
		return {
			firstName: '',
			lastName: '',
			email: '',
			adminRole: '',
			password: '',
			confirmPassword: '',
		};
	};

	const [formData, setFormData] = useState(getInitialFormData);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const adminRoles = [
		{ value: '', label: 'Select admin role' },
		{ value: 'auditor', label: 'Auditor' },
		{ value: 'finance_admin', label: 'Finance Admin' },
		{ value: 'content_manager', label: 'Content Manager' },
		{ value: 'support_admin', label: 'Support Admin' },
	];

	// Password validation rules
	const passwordRules = [
		{
			id: 'minLength',
			label: '8 character minimum',
			test: (pwd) => pwd.length >= 8,
		},
		{
			id: 'uppercase',
			label: 'One uppercase',
			test: (pwd) => /[A-Z]/.test(pwd),
		},
		{ id: 'number', label: 'One number', test: (pwd) => /\d/.test(pwd) },
		{
			id: 'special',
			label: 'One special character',
			test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
		},
	];

	const resetForm = () => {
		setFormData({
			firstName: '',
			lastName: '',
			email: '',
			adminRole: '',
			password: '',
			confirmPassword: '',
		});
		setErrors({});
	};

	// Update form when modal opens/closes or initialData changes
	useEffect(() => {
		if (!isOpen) return;

		// If editing, load the initial data
		if (initialData) {
			setFormData({
				firstName: initialData.firstName || '',
				lastName: initialData.lastName || '',
				email: initialData.email || '',
				adminRole: initialData.adminRole || '',
				password: '',
				confirmPassword: '',
			});
		} else {
			resetForm();
		}
	}, [isOpen, initialData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error for this field
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};

		if (!formData.firstName.trim())
			newErrors.firstName = 'First name is required';
		if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = 'Invalid email format';
		}
		if (!formData.adminRole) newErrors.adminRole = 'Admin role is required';

		// Password validation
		if (!formData.password) {
			newErrors.password = 'Password is required';
		} else {
			const failedRules = passwordRules.filter(
				(rule) => !rule.test(formData.password)
			);
			if (failedRules.length > 0) {
				newErrors.password = 'Password does not meet requirements';
			}
		}

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Please confirm password';
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (validateForm()) {
			onSubmit(formData);
			onClose();
			resetForm();
		}
	};

	const handleClose = () => {
		onClose();
		resetForm();
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 bg-opacity-50'>
			<div className='bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto scrollbar-hide'>
				{/* Header */}
				<div className='flex items-center justify-between p-6 pb-2'>
					<h2 className='text-2xl/9 font-bold text-[#1A1A1A]'>
						{initialData ? 'Edit sub-admin' : 'Create sub-admin'}
					</h2>
					<button
						onClick={handleClose}
						className='bg-[#F7F7F7] rounded-xl text-foreground h-10 w-10  flex items-center justify-center cursor-pointer'>
						<X className='w-6 h-6' />
					</button>
				</div>

				{/* Body */}
				<div className='p-6'>
					<div className='flex flex-col gap-4'>
						{/* Name Fields */}
						<div className='grid grid-cols-2 gap-4'>
							<div className='flex flex-col gap-2'>
								<label
									htmlFor='firstName'
									className='text-sm font-medium text-gray-700'>
									First name
								</label>
								<input
									id='firstName'
									name='firstName'
									type='text'
									value={formData.firstName}
									onChange={handleChange}
									className={`border rounded-lg px-3 py-2.5 outline-none  ${
										errors.firstName ? 'border-red-500' : 'border-foreground'
									}`}
									placeholder='E.g Elizabeth'
								/>
							</div>

							<div className='flex flex-col gap-2'>
								<label
									htmlFor='lastName'
									className='text-sm font-medium text-gray-700'>
									Last name
								</label>
								<input
									id='lastName'
									name='lastName'
									type='text'
									value={formData.lastName}
									onChange={handleChange}
									className={`border rounded-lg px-3 py-2.5 outline-none  ${
										errors.lastName ? 'border-red-500' : 'border-foreground'
									}`}
									placeholder='E.g Horst'
								/>
							</div>
						</div>

						{/* Email */}
						<div className='flex flex-col gap-2'>
							<label
								htmlFor='email'
								className='text-sm font-medium text-gray-700'>
								Email address
							</label>
							<input
								id='email'
								name='email'
								type='email'
								value={formData.email}
								onChange={handleChange}
								className={`border rounded-lg px-3 py-2.5 outline-none  ${
									errors.email ? 'border-red-500' : 'border-foreground'
								}`}
								placeholder='E.g elkhorst3@gmail.com'
							/>
						</div>

						{/* Admin Role */}
						<div className='flex flex-col gap-2'>
							<label
								htmlFor='adminRole'
								className='text-sm font-medium text-gray-700'>
								Admin role
							</label>
							<select
								id='adminRole'
								name='adminRole'
								value={formData.adminRole}
								onChange={handleChange}
								className={`border rounded-lg px-3 py-2.5 outline-none  appearance-none bg-white ${
									errors.adminRole ? 'border-red-500' : 'border-foreground'
								}`}>
								{adminRoles.map((role) => (
									<option
										key={role.value}
										value={role.value}>
										{role.label}
									</option>
								))}
							</select>
						</div>

						{/* Password */}
						<div className='flex flex-col gap-2'>
							<label
								htmlFor='password'
								className='text-sm font-medium text-gray-700'>
								Password
							</label>
							<div className='relative'>
								<input
									id='password'
									name='password'
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={handleChange}
									className={`w-full border rounded-lg px-3 py-2.5 pr-10 outline-none  ${
										errors.password ? 'border-red-500' : 'border-foreground'
									}`}
									placeholder='Create password'
								/>
								<button
									type='button'
									onClick={() => setShowPassword(!showPassword)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
									{showPassword ? (
										<EyeOff className='w-5 h-5' />
									) : (
										<Eye className='w-5 h-5' />
									)}
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div className='flex flex-col gap-2'>
							<label
								htmlFor='confirmPassword'
								className='text-sm font-medium text-gray-700'>
								Confirm password
							</label>
							<div className='relative'>
								<input
									id='confirmPassword'
									name='confirmPassword'
									type={showConfirmPassword ? 'text' : 'password'}
									value={formData.confirmPassword}
									onChange={handleChange}
									className={`w-full border rounded-lg px-3 py-2.5 pr-10 outline-none  ${
										errors.confirmPassword
											? 'border-red-500'
											: 'border-foreground'
									}`}
									placeholder='Confirm password'
								/>
								<button
									type='button'
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
									{showConfirmPassword ? (
										<EyeOff className='w-5 h-5' />
									) : (
										<Eye className='w-5 h-5' />
									)}
								</button>
							</div>
						</div>

						{/* Password Requirements */}
						<div className='grid grid-cols-2 gap-2 mt-2'>
							{passwordRules.map((rule) => {
								const isValid = rule.test(formData.password);
								return (
									<div
										key={rule.id}
										className='flex items-center gap-2'>
										<div
											className={`w-4 h-4 rounded-full flex items-center justify-center ${
												isValid ? 'bg-[#FAAA32]' : 'bg-gray-200'
											}`}>
											<Check
												className={`w-3 h-3 text-white ${
													isValid ? 'text-subText/50' : ''
												}`}
											/>
										</div>
										<span
											className={`text-xs ${
												isValid ? 'text-[#FAAA32]' : 'text-gray-500'
											}`}>
											{rule.label}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className='p-6'>
					<button
						onClick={handleSubmit}
						className='w-full bg-[#FAAA32] rounded-xl text-foreground py-3 font-semibold hover:bg-[#e99a22] transition-colors'>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default CreateSubAdminModal;
