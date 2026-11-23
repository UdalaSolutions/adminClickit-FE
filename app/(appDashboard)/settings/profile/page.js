/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary } from '../../../utils/cloudinaryUpload';
import { getCurrentUser, updateCurrentUser, getList } from '../../../utils/api';

const ProfileSettings = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		profileImage: null,
	});
	const [role, setRole] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const [uploading, setUploading] = useState(false);

	// Pre-fill from the signed-in user, then confirm email/role with the backend
	useEffect(() => {
		const user = getCurrentUser() || {};
		setFormData({
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			email: user.email || '',
			profileImage: user.profileImage || null,
		});
		setRole(user.role || '');

		if (!user.email) {
			setLoading(false);
			return;
		}
		// GET /api/user/get-all -> { id, email, userRole, dateTimeJoined }
		getList('/api/user/get-all', 'users')
			.then((users) => {
				const me = users.find(
					(u) => u.email?.toLowerCase() === user.email.toLowerCase(),
				);
				if (!me) return;
				setRole(me.userRole || user.role || '');
				// Use backend names if it ever starts returning them
				setFormData((prev) => ({
					...prev,
					firstName: prev.firstName || me.firstName || '',
					lastName: prev.lastName || me.lastName || '',
				}));
				updateCurrentUser({ id: me.id, role: me.userRole || user.role });
			})
			.catch(() => {})
			.finally(() => setLoading(false));
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error('Please upload an image file');
			return;
		}

		// Validate size below 5MB
		if (file.size > 5 * 1024 * 1024) {
			toast.error('Image size must be less than 5MB');
			return;
		}

		setUploading(true);

		try {
			// Upload using your util function
			const secureUrl = await uploadImageToCloudinary(file);

			setFormData((prev) => ({
				...prev,
				profileImage: secureUrl,
			}));

			setImagePreview(secureUrl);
			updateCurrentUser({ profileImage: secureUrl });

			toast.success('Image uploaded successfully!');
		} catch (error) {
			console.error('Upload error:', error);
			toast.error('Failed to upload image. Please try again.');
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const firstName = formData.firstName.trim();
		const lastName = formData.lastName.trim();
		if (!firstName || !lastName) {
			toast.error('Please enter your first and last name');
			return;
		}
		setSaving(true);
		try {
			// Saved on this device only. The backend has no profile endpoint, and
			// PUT /api/user/edit needs the password field (risk of blanking it).
			updateCurrentUser({
				firstName,
				lastName,
				profileImage: formData.profileImage,
			});
			toast.success('Profile updated successfully!');
		} catch {
			toast.error('Failed to update profile. Please try again.');
		} finally {
			setSaving(false);
		}
	};

	const inputClass =
		'border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FAAA32] focus:ring-1 focus:ring-[#FAAA32]';
	const roleLabel = role
		? role
				.toLowerCase()
				.split('_')
				.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
				.join(' ')
		: '';

	return (
		<div>
			<h1 className='border-[#E6E6E6] border-b p-3 font-bold text-xl leading-7.5 text-[#1A1A1A]'>
				Profile
			</h1>

			<div className='p-6'>
				<div className='flex flex-col gap-8'>
					{/* Profile Image Upload */}
					<div className='flex flex-col gap-4'>
						<div className='flex items-center gap-6'>
							<div className='relative'>
								<div className='w-[100px] h-[100px] rounded-[50px] flex items-center justify-center bg-[#E6E6E6] overflow-hidden'>
									{imagePreview || formData.profileImage ? (
										<img
											src={imagePreview || formData.profileImage}
											alt='Profile'
											width={100}
											height={100}
											className='w-full h-full object-cover'
										/>
									) : (
										<User className='w-12 h-12 text-[#b3b3b3]' />
									)}
								</div>
							</div>

							<div className='flex flex-col gap-2'>
								<label
									htmlFor='image-upload'
									className='cursor-pointer justify-center flex items-center gap-2 px-2 py-2 bg-[#FFF7EB] rounded-lg font-medium transition-colors text-[#FAAA32]'>
									{uploading ? 'Uploading...' : 'Upload image'}
								</label>
								<input
									id='image-upload'
									type='file'
									accept='image/*'
									onChange={handleImageUpload}
									disabled={uploading}
									className='hidden'
								/>
								<span className='text-xs text-gray-500'>
									Recommended: Square image, max 5MB
								</span>
							</div>
						</div>
					</div>

					{/* Name Fields */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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
								className={inputClass}
								placeholder={loading ? 'Loading...' : 'Enter your first name'}
								required
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
								className={inputClass}
								placeholder={loading ? 'Loading...' : 'Enter your last name'}
								required
							/>
						</div>
					</div>

					{/* Email Field */}
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
							readOnly
							className='border border-gray-200 rounded-lg px-4 py-2.5 outline-none bg-[#FAFAFA] text-[#666666] cursor-not-allowed'
							placeholder={loading ? 'Loading...' : ''}
						/>
						<span className='text-xs text-[#999999]'>
							This is the email you sign in with
							{roleLabel ? ` · ${roleLabel}` : ''}
						</span>
					</div>

					{/* Submit Button */}
					<div className='flex justify-end pt-4'>
						<button
							onClick={handleSubmit}
							disabled={saving || loading}
							className='px-8 py-3 bg-[#FAAA32] text-[#111111] rounded-xl font-semibold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'>
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileSettings;
