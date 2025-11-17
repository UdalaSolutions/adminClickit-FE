import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	error,
	showToggle,
	onToggle,
	showPassword,
}) => (
	<div className='mb-4'>
		<label className='block text-sm text-[#666666] mb-2'>{label}</label>
		<div className='relative'>
			<input
				type={showToggle && !showPassword ? 'password' : type}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={`w-full px-4 py-3 border ${
					error ? 'border-red-500' : 'border-[#E6E6E6]'
				} rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200`}
			/>
			{showToggle && (
				<button
					type='button'
					onClick={onToggle}
					className='absolute right-4 top-1/2 -translate-y-1/2 text-[#999999]'>
					{showPassword ? (
						<Eye className='w-5 h-5' />
					) : (
						<EyeOff className='w-5 h-5' />
					)}
				</button>
			)}
		</div>
	</div>
);
