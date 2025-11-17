const EmptyState = ({ onCreateClick }) => {
	return (
		<div className='flex flex-col items-center justify-center py-16 px-4'>
			<div className='text-center max-w-sm'>
				<h3 className='text-lg font-semibold text-gray-900 mb-2'>
					No sub-admin yet
				</h3>
				<p className='text-sm text-gray-500 mb-6'>
					All sub-admins you create will appear here.
				</p>
				<button
					onClick={onCreateClick}
					className='bg-[#FAAA32] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e99a22] transition-colors'>
					Create admin
				</button>
			</div>
		</div>
	);
};

export default EmptyState;
