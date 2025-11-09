export const getStatusStyles = (statusColor) => {
	switch (statusColor) {
		case 'green':
			return 'text-[#049A04] bg-[#049A040F]';
		case 'red':
			return 'text-[#F20D0D] bg-[#F20D0D0F]';
		case 'orange':
			return 'text-[#FAAF00] bg-[#FAAF000F]';
		default:
			return 'text-gray-600 bg-gray-50';
	}
};
