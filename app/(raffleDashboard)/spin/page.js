'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LotteryWheel = () => {
	const [isSpinning, setIsSpinning] = useState(false);
	const [rotation, setRotation] = useState(0);
	const [winner, setWinner] = useState(null);
	const [entries] = useState([
		'+234 802 345 6789',
		'+234 803 912 4567',
		'+234 701 223 8899',
		'+234 805 678 2345',
		'+234 706 112 3344',
		'+234 809 765 1122',
		'+234 812 998 7766',
		'+234 814 234 5566',
		'+234 816 789 9900',
		'+234 817 123 4560',
		'+234 818 654 3211',
		'+234 909 876 5432',
	]);

	const totalEntries = 2641;

	const handleSpin = () => {
		if (isSpinning) return;

		setIsSpinning(true);
		setWinner(null);

		// Pick a random winner
		const winnerIndex = Math.floor(Math.random() * entries.length);

		// Calculate rotation to land winner at top (12 o'clock / y-axis)
		const segmentAngle = 360 / entries.length;
		const winnerAngle = winnerIndex * segmentAngle;

		// Full spins + rotation to position winner at top
		const spins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
		const targetRotation = spins * 360 - winnerAngle + segmentAngle / 2;

		setRotation(targetRotation);

		setTimeout(() => {
			setIsSpinning(false);
			setWinner(entries[winnerIndex]);
		}, 5000);
	};

	const segmentAngle = 360 / entries.length;

	return (
		<div className='min-h-screen bg-background flex flex-col '>
			{/* Header */}
			<header className='p-6 flex items-center justify-between '>
				<div className='flex items-center gap-2'>
					<Image
						src='/appDashboard/clickit-logo.svg'
						alt='logo'
						width={163}
						height={50}
					/>
				</div>
				<button className='bg-[#FAAA321A] flex items-center gap-2 text-[#FAAA32] font-semibold rounded-[50px] py-3 px-6'>
					Menu <Menu size={20} />
				</button>
			</header>

			{/* Main Content */}
			<main className='w-full flex items-center justify-center pt-6'>
				<div className='relative'>
					{/* Pointer */}
					<div className='absolute -top-3 left-1/2 -translate-x-1/2 -translate-y-2 z-10'>
						<Image
							src='/appDashboard/pin.svg'
							alt='pin'
							width={75}
							height={60}
						/>
					</div>

					{/* Wheel */}
					<div className='relative w-[500px] h-[500px]'>
						<motion.svg
							width='500'
							height='500'
							viewBox='0 0 500 500'
							animate={{ rotate: rotation }}
							transition={{
								duration: 5,
								ease: [0.22, 1, 0.36, 1],
							}}>
							{/* Outer circle border */}
							<circle
								cx='250'
								cy='250'
								r='232'
								fill='none'
								stroke='#1a1a1a'
								strokeWidth='35'
							/>

							{/* Wheel segments */}
							{entries.map((entry, index) => {
								const startAngle =
									(index * segmentAngle - 90) * (Math.PI / 180);
								const endAngle =
									((index + 1) * segmentAngle - 90) * (Math.PI / 180);
								const midAngle =
									((index + 0.5) * segmentAngle - 90) * (Math.PI / 180);

								const x1 = 250 + 240 * Math.cos(startAngle);
								const y1 = 250 + 240 * Math.sin(startAngle);
								const x2 = 250 + 240 * Math.cos(endAngle);
								const y2 = 250 + 240 * Math.sin(endAngle);

								// Text position - place it radially outward from center
								const textRadius = 180;
								const textX = 250 + textRadius * Math.cos(midAngle);
								const textY = 250 + textRadius * Math.sin(midAngle);

								// Text angle should follow the curve, reading from outer edge inward
								// Subtract 90 to make text perpendicular to radius (tangent to circle)
								const textAngle = index * segmentAngle + segmentAngle / 2 - 90;

								// Alternating shades of orange
								const fillColor = index % 2 === 0 ? '#FAAA32' : '#FFC857';

								return (
									<g key={index}>
										<path
											d={`M 250 250 L ${x1} ${y1} A 240 240 0 0 1 ${x2} ${y2} Z`}
											fill={fillColor}
											stroke='#fff'
											strokeWidth=''
										/>
										<text
											x={textX}
											y={textY}
											fill='#1e293b'
											fontSize='14'
											fontWeight='500'
											textAnchor='end'
											dominantBaseline='middle'
											transform={`rotate(${textAngle}, ${textX}, ${textY})`}>
											{entry}
										</text>
									</g>
								);
							})}

							{/* Center circle */}
							<circle
								cx='250'
								cy='250'
								r='25'
								fill='white'
								stroke='#0B132A'
								strokeWidth='2'
							/>
						</motion.svg>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer
				className='p-10 py-32 flex items-center justify-between bg-cover bg-center -mt-28'
				style={{ backgroundImage: "url('/spin/background.svg')" }}>
				<div className='bg-[#0B132A] text-white px-6 py-4 rounded-[50px] font-bold text-xl leading-9 cursor-pointer'>
					Total Entries: {totalEntries.toLocaleString()}
				</div>
				<button
					onClick={handleSpin}
					disabled={isSpinning}
					className={`bg-[#FAAA32] text-foreground w-[260px] py-4 rounded-[50px] transition-all font-bold text-xl leading-9 cursor-pointer ${
						isSpinning ? 'opacity-50 cursor-not-allowed' : ''
					}`}>
					Spin
				</button>
			</footer>
		</div>
	);
};

export default LotteryWheel;
