import { CheckCircle2 } from 'lucide-react';

export const PasswordRequirements = ({ password }) => {
	const requirements = [
		{ label: '8 character minimum', met: password.length >= 8 },
		{ label: 'One uppercase', met: /[A-Z]/.test(password) },
		{ label: 'One number', met: /\d/.test(password) },
		{
			label: 'One special character',
			met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		},
	];

	return (
		<div className='grid grid-cols-2 gap-2 mb-4'>
			{requirements.map((req, index) => (
				<div
					key={index}
					className='flex items-center gap-2'>
					<CheckCircle2
						className={`w-4 h-4 ${
							req.met ? 'text-[#FF9500]' : 'text-[#E6E6E6]'
						}`}
					/>
					<span
						className={`text-sm ${
							req.met ? 'text-[#FF9500]' : 'text-[#999999]'
						}`}>
						{req.label}
					</span>
				</div>
			))}
		</div>
	);
};
