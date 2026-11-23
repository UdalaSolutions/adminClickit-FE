'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import CreateSubAdminModal from '../../../components/modal/CreateSubAdminModal';
import SubAdminCard from '../../../components/appDashboard/settings/SubAdminCard';
import EmptyState from '../../../components/appDashboard/settings/EmptyState';
import { api, getList } from '../../../utils/api';
import ConfirmModal from '../../../components/common/ConfirmModal';

const mapAdmin = (u) => ({
	id: u.id,
	name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || '-',
	role: u.userRole || u.role || 'Admin',
	email: u.email,
	lastLogin: u.lastLogin || u.lastLoginAt || null,
	profileImage: u.profileImage || null,
});

const SubAdminSettingsPage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAdmin, setEditingAdmin] = useState(null);
	const [editingAdminId, setEditingAdminId] = useState(null);
	const [subAdmins, setSubAdmins] = useState([]);

	useEffect(() => {
		getList('/api/user/get-all', 'users')
			.then((list) => {
				setSubAdmins(list.map(mapAdmin));
			})
			.catch(() => {});
	}, []);

	const handleOpenModal = (admin = null) => {
		setEditingAdmin(admin);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingAdmin(null);
		setEditingAdminId(null);
	};

	const handleSubmit = async (formData) => {
		try {
			if (editingAdminId) {
				await api.put(`/api/user/edit/${editingAdminId}`, {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					userRole: formData.adminRole,
				});
				setSubAdmins((prev) =>
					prev.map((admin) =>
						admin.id === editingAdminId
							? {
									...admin,
									name: `${formData.firstName} ${formData.lastName}`,
									role: formData.adminRole,
									email: formData.email,
								}
							: admin,
					),
				);
				toast.success('Sub-admin updated successfully!');
			} else {
				const data = await api.post('/api/user/register', {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
					userRole: formData.adminRole,
				});
				const newId = data.id || data.data?.id || Date.now();
				setSubAdmins((prev) => [
					...prev,
					{
						id: newId,
						name: `${formData.firstName} ${formData.lastName}`,
						role: formData.adminRole,
						email: formData.email,
						lastLogin: null,
						profileImage: null,
					},
				]);
				toast.success('Sub-admin created successfully!');
			}
		} catch (err) {
			toast.error(err.message || 'Failed to save sub-admin. Please try again.');
		}
	};

	const handleEdit = (admin) => {
		setEditingAdminId(admin.id);
		const formData = {
			firstName: admin.name.split(' ')[0],
			lastName: admin.name.split(' ').slice(1).join(' '),
			email: admin.email,
			adminRole: admin.role,
		};
		handleOpenModal(formData);
	};

	const [adminToDelete, setAdminToDelete] = useState(null);
	const [deleting, setDeleting] = useState(false);

	// SubAdminCard passes the admin id
	const handleDelete = (adminId) =>
		setAdminToDelete(subAdmins.find((a) => a.id === adminId) || { id: adminId });

	const confirmDelete = async () => {
		if (!adminToDelete) return;
		setDeleting(true);
		try {
			await api.delete(`/api/user/delete/${adminToDelete.id}`);
			setSubAdmins((prev) =>
				prev.filter((admin) => admin.id !== adminToDelete.id),
			);
			toast.success('Sub-admin deleted successfully!');
		} catch (err) {
			toast.error(err.message || 'Failed to delete sub-admin. Please try again.');
		} finally {
			setDeleting(false);
			setAdminToDelete(null);
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

			<ConfirmModal
				open={!!adminToDelete}
				title='Delete sub-admin?'
				message={
					adminToDelete &&
					`${adminToDelete.name && adminToDelete.name !== '-' ? adminToDelete.name : adminToDelete.email || 'This sub-admin'} will lose access to the dashboard. This cannot be undone.`
				}
				confirmText='Delete'
				loading={deleting}
				onConfirm={confirmDelete}
				onCancel={() => setAdminToDelete(null)}
			/>
		</div>
	);
};

export default SubAdminSettingsPage;
