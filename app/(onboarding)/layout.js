import Image from 'next/image';

export default function Layout({ children }) {
	return (
		<div className='relative overflow-hidden'>
			<Image
				src='/onboarding/onboarding_background1.svg'
				alt='background'
				width={400}
				height={444}
				className='absolute right-0 z-10 hidden md:block'
			/>
			<div className='min-h-screen flex items-center justify-center relative z-20'>
				{children}
			</div>
			<Image
				src='/onboarding/onboarding_background2.svg'
				alt='background'
				width={400}
				height={444}
				className='absolute bottom-0 z-10 hidden md:block'
			/>
		</div>
	);
}
