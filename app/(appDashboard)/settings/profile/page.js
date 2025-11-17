/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { Upload, User } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary } from '../../../utils/cloudinaryUpload';

const ProfileSettings = () => {
	const [formData, setFormData] = useState({
		firstName: 'John',
		lastName: 'Brown',
		email: 'johnbrown02@gmail.com',
		profileImage: null,
	});
	const [imagePreview, setImagePreview] = useState(null);
	const [uploading, setUploading] = useState(false);

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

		try {
			toast.success('Profile updated successfully!');
		} catch (error) {
			toast.error('Failed to update profile. Please try again.');
		}
	};

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
					<div className='grid grid-cols-2 gap-6'>
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
								className='border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FAAA32] focus:ring-1 focus:ring-[#FAAA32]'
								placeholder='John'
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
								className='border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FAAA32] focus:ring-1 focus:ring-[#FAAA32]'
								placeholder='Brown'
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
							onChange={handleChange}
							className='border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-[#FAAA32] focus:ring-1 focus:ring-[#FAAA32]'
							placeholder='johnbrown02@gmail.com'
							required
						/>
					</div>

					{/* Submit Button */}
					<div className='flex justify-end pt-4'>
						<button
							onClick={handleSubmit}
							className='px-8 py-3 bg-[#FAAA32] text-[#111111] rounded-xl font-semibold transition-colors cursor-pointer'>
							Save Changes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileSettings;
