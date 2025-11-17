/* eslint-disable @next/next/no-img-element */
import { MoreVertical, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const SubAdminCard = ({ admin, onEdit, onDelete }) => {
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu]);

	const formatLastLogin = (dateString) => {
		if (!dateString) return 'Never logged in';

		const date = new Date(dateString);
		const now = new Date();
		const diffInMs = now - date;
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

		if (diffInHours < 24) {
			return `${diffInHours}h ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			return `${diffInDays}d ago`;
		}

		return date.toLocaleDateString('en-US', {
			month: '2-digit',
			day: '2-digit',
			year: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	};

	return (
		<div className='flex items-center justify-between bg-[#FAFAFA]  rounded-xl mt-2 p-3'>
			<div className='flex items-center gap-4'>
				{/* Avatar */}
				<div className='w-20 h-20 rounded-full bg-[#E6E6E6] flex items-center justify-center'>
					{admin.profileImage ? (
						<img
							src={admin.profileImage}
							alt={admin.name}
							className='w-full h-full rounded-full object-cover'
						/>
					) : (
						<User className='w-6 h-6 text-gray-400' />
					)}
				</div>

				{/* Info */}
				<div className='flex flex-col gap-1'>
					<h3 className='font-semibold text-foreground'>{admin.name}</h3>
					<p className=' text-[#3D3D3D]'>{admin.role}</p>
					<p className='text-sm text-[#999999] mt-0.5'>
						Last login: {formatLastLogin(admin.lastLogin)}
					</p>
				</div>
			</div>

			{/* Actions Menu */}
			<div
				className='relative'
				ref={menuRef}>
				<button
					onClick={() => setShowMenu(!showMenu)}
					className='p-2  cursor-pointer'>
					<MoreVertical className='w-5 h-5 text-gray-600' />
				</button>

				{showMenu && (
					<div className='absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10'>
						<button
							onClick={() => {
								onEdit(admin);
								setShowMenu(false);
							}}
							className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors'>
							Edit
						</button>
						<button
							onClick={() => {
								onDelete(admin.id);
								setShowMenu(false);
							}}
							className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default SubAdminCard;
