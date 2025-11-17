'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { message } from 'antd';
import CreateSubAdminModal from '../../../components/modal/CreateSubAdminModal';
import SubAdminCard from '../../../components/appDashboard/settings/SubAdminCard';
import EmptyState from '../../../components/appDashboard/settings/EmptyState';

const SubAdminSettingsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAdmin, setEditingAdmin] = useState(null);
	const [subAdmins, setSubAdmins] = useState([
		{
			id: 1,
			name: 'Elizabeth Horst',
			role: 'Finance admin',
			email: 'elkhorst3@gmail.com',
			lastLogin: '2025-10-31T10:20:59',
			profileImage: null,
		},
		{
			id: 2,
			name: 'Emmanuel Johnson',
			role: 'Auditor',
			email: 'ejohnson@example.com',
			lastLogin: '2025-10-31T10:20:59',
			profileImage: null,
		},
	]);

	const handleOpenModal = (admin = null) => {
		setEditingAdmin(admin);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingAdmin(null);
	};

	const handleSubmit = async (formData) => {
		try {
			if (editingAdmin) {
				// Update existing admin
				setSubAdmins((prev) =>
					prev.map((admin) =>
						admin.id === editingAdmin.id
							? {
									...admin,
									...formData,
									name: `${formData.firstName} ${formData.lastName}`,
									role: formData.adminRole,
							  }
							: admin
					)
				);
				message.success('Sub-admin updated successfully!');
			} else {
				// Create new admin
				const newAdmin = {
					id: Date.now(),
					name: `${formData.firstName} ${formData.lastName}`,
					role: formData.adminRole,
					email: formData.email,
					lastLogin: null,
					profileImage: null,
				};
				setSubAdmins((prev) => [...prev, newAdmin]);
				message.success('Sub-admin created successfully!');
			}

			// Here you would make your API call
			// await createSubAdmin(formData);
		} catch (error) {
			message.error('Failed to save sub-admin. Please try again.');
		}
	};

	const handleEdit = (admin) => {
		const formData = {
			firstName: admin.name.split(' ')[0],
			lastName: admin.name.split(' ').slice(1).join(' '),
			email: admin.email,
			adminRole: admin.role.toLowerCase().replace(' ', '_'),
		};
		handleOpenModal(formData);
	};

	const handleDelete = async (adminId) => {
		try {
			// Confirm deletion
			if (window.confirm('Are you sure you want to delete this sub-admin?')) {
				setSubAdmins((prev) => prev.filter((admin) => admin.id !== adminId));
				message.success('Sub-admin deleted successfully!');

				// Here you would make your API call
				// await deleteSubAdmin(adminId);
			}
		} catch (error) {
			message.error('Failed to delete sub-admin. Please try again.');
		}
	};

	return (
		<div>
			<div className='flex items-center justify-between border-[#E6E6E6] border-b py-3'>
				<h1 className='font-bold text-xl leading-7.5 text-[#1A1A1A]'>
					Sub-admin access
				</h1>
				{subAdmins.length > 0 && (
					<button
						onClick={() => handleOpenModal()}
						className='flex items-center gap-1 cursor-pointer bg-[#FAAA32] text-foreground font-bold px-4 py-2 rounded-xl  hover:bg-[#e99a22] transition-colors'>
						<Plus className='w-6 h-6' />
						Add admin
					</button>
				)}
			</div>

			<div className='py-6'>
				{subAdmins.length === 0 ? (
					<EmptyState onCreateClick={() => handleOpenModal()} />
				) : (
					<div className='flex flex-col gap-2'>
						{subAdmins.map((admin) => (
							<SubAdminCard
								key={admin.id}
								admin={admin}
								onEdit={handleEdit}
								onDelete={handleDelete}
							/>
						))}
					</div>
				)}
			</div>

			<CreateSubAdminModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				initialData={editingAdmin}
			/>
		</div>
	);
};

export default SubAdminSettingsPage;
