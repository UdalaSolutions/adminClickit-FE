'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';

import {
	ALL_NUMBERS,
	WHEEL_SEGMENT_COUNT,
	DISPLAY_COUNT,
	buildPrizes,
} from '../../components/spin/spinData';
import WheelStars from '../../components/spin/WheelStars';
import ConfettiCanvas from '../../components/spin/ConfettiCanvas';
import WinModal from '../../components/spin/WinModal';
import NumberTicker from '../../components/spin/NumberTicker';
import LoadingScreen from '../../components/spin/LoadingScreen';

export default function SpinPage() {
	const containerRef = useRef(null);
	const wheelRef = useRef(null);

	const [isLoading, setIsLoading] = useState(true);
	const [isSpinning, setIsSpinning] = useState(false);
	const [winner, setWinner] = useState(null);
	const [winnerIndex, setWinnerIndex] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [hasSpun, setHasSpun] = useState(false);
	const [wheelSize, setWheelSize] = useState(320);
	const [wheelReady, setWheelReady] = useState(false);

	const [displayNums, setDisplayNums] = useState(
		ALL_NUMBERS.slice(0, DISPLAY_COUNT),
	);
	const [pulsingIndex, setPulsingIndex] = useState(null);

	// Track container size for star positioning
	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) setWheelSize(containerRef.current.offsetWidth);
		};
		updateSize();
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	// Mount wheel
	useEffect(() => {
		const minDelay = new Promise((r) => setTimeout(r, 5000));

		Promise.all([import('spin-wheel'), minDelay])
			.then(([{ Wheel }]) => {
				if (!containerRef.current) {
					setIsLoading(false);
					return;
				}

				const wheel = new Wheel(containerRef.current, {
					items: buildPrizes(ALL_NUMBERS),
					itemLabelFont: 'Inter, serif',
					itemLabelFontSizeMax: 15,
					itemLabelRadius: 0.82,
					itemLabelRadiusMax: 0.2,
					itemLabelRotation: 180,
					itemLabelAlign: 'left',
					itemLabelColors: ['#fff'],
					lineColor: '#ffffff',
					lineWidth: 1,
					borderColor: 'transparent',
					borderWidth: 0,
					radius: 0.92,
					rotationResistance: -20,
					isInteractive: false,
					pointerAngle: 0,

					onRest: (event) => {
						const idx = event.currentIndex;
						setWinnerIndex(idx);
						setWinner(null);
						setIsSpinning(false);
						setHasSpun(true);
					},
				});

				wheelRef.current = wheel;
				setWheelReady(true);
				setIsLoading(false);
			})
			.catch(() => setIsLoading(false));

		return () => {
			if (wheelRef.current) {
				wheelRef.current.remove();
				wheelRef.current = null;
			}
		};
	}, []);

	// Spin interval — keeps displayNums and wheel items in sync
	const intervalRef = useRef(null);
	const slotRef = useRef(0);
	const winnerNumRef = useRef(null);

	useEffect(() => {
		if (isSpinning) {
			slotRef.current = 0;
			winnerNumRef.current = null;

			intervalRef.current = setInterval(() => {
				const slotIdx = slotRef.current % DISPLAY_COUNT;
				const rnd = Math.floor(Math.random() * ALL_NUMBERS.length);
				const newNum = ALL_NUMBERS[rnd];

				setDisplayNums((prev) => {
					const next = [...prev];
					next[slotIdx] = newNum;

					if (wheelRef.current) {
						wheelRef.current.items = buildPrizes(next);
					}

					return next;
				});

				setPulsingIndex(slotIdx);
				slotRef.current++;
			}, 120);
		} else {
			if (intervalRef.current) clearInterval(intervalRef.current);
			setPulsingIndex(null);

			if (hasSpun && winnerIndex !== null) {
				setDisplayNums((prev) => {
					const winningNum = prev[winnerIndex] ?? ALL_NUMBERS[winnerIndex];
					winnerNumRef.current = winningNum;

					const base = ALL_NUMBERS.filter((n) => n !== winningNum)
						.sort(() => Math.random() - 0.5)
						.slice(0, DISPLAY_COUNT - 1);
					const insertAt = Math.floor(Math.random() * DISPLAY_COUNT);
					return [
						...base.slice(0, insertAt),
						winningNum,
						...base.slice(insertAt),
					];
				});

				setTimeout(() => {
					if (winnerNumRef.current) {
						setWinner(winnerNumRef.current);
						setTimeout(() => {
							setShowConfetti(true);
							setTimeout(() => setShowModal(true), 350);
							setTimeout(() => setShowConfetti(false), 5500);
						}, 300);
					}
				}, 80);
			}
		}

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isSpinning, hasSpun, winnerIndex]);

	const handleSpin = useCallback(() => {
		if (isSpinning || !wheelRef.current || !wheelReady) return;
		const idx = Math.floor(Math.random() * WHEEL_SEGMENT_COUNT);
		setIsSpinning(true);
		setShowModal(false);
		setWinner(null);
		setWinnerIndex(null);
		setHasSpun(false);
		wheelRef.current.spinToItem(idx, 7000, true, 3, 1);
	}, [isSpinning, wheelReady]);

	const handleNewDraw = () => {
		setShowModal(false);
		setWinner(null);
		setWinnerIndex(null);
		setHasSpun(false);
	};

	return (
		<>
			<style>{`
				@keyframes modalPop {
					from { opacity: 0; transform: scale(0.82) translateY(16px); }
					to { opacity: 1; transform: scale(1) translateY(0); }
				}
				@keyframes bounceIn {
					0% { transform: scale(0); }
					60% { transform: scale(1.25); }
					100% { transform: scale(1); }
				}
				@keyframes spinnerRing {
					to { transform: rotate(360deg); }
				}
			`}</style>

			<LoadingScreen visible={isLoading} />
			<ConfettiCanvas active={showConfetti} />

			{showModal && (
				<WinModal
					winner={winner}
					onClose={() => setShowModal(false)}
					onRetry={handleNewDraw}
				/>
			)}

			<div className='min-h-screen bg-white flex flex-col'>
				<header className='p-6 flex items-center justify-between'>
					<Image
						src='/appDashboard/clickit-logo.svg'
						alt='logo'
						width={163}
						height={50}
					/>
					<button className='bg-[#FAAA321A] flex items-center gap-2 text-[#FAAA32] font-semibold rounded-[50px] py-3 px-6'>
						Menu <Menu size={20} />
					</button>
				</header>

				<main className='flex-1 flex flex-col items-center justify-end relative overflow-visible'>
					<div className='flex items-end justify-center gap-16 w-full px-4 relative z-10 mb-[-160px] sm:mb-[-275px] lg:mb-[-325px]'>
						{/* Left: Entry pool ticker */}
						<div
							className='hidden lg:flex flex-col gap-3 shrink-0 self-start pt-14'
							style={{ width: 250 }}>
							<div className='flex items-center justify-between mb-1'>
								<span
									style={{
										fontSize: 11,
										fontWeight: 700,
										color: '#9ca3af',
										letterSpacing: '0.12em',
										textTransform: 'uppercase',
									}}>
									Entry Pool
								</span>
								{isSpinning && (
									<span
										style={{
											background: '#fff7ed',
											color: '#f5614e',
											fontSize: 10,
											fontWeight: 800,
											letterSpacing: '0.1em',
											borderRadius: 20,
											padding: '3px 10px',
											border: '1px solid #FAA95A',
										}}>
										LIVE
									</span>
								)}
							</div>
							<NumberTicker
								displayNums={displayNums}
								pulsingIndex={pulsingIndex}
								isSpinning={isSpinning}
								winner={winner}
								hasSpun={hasSpun}
							/>
							<p
								style={{
									textAlign: 'center',
									color: '#d1d5db',
									fontSize: 10,
									margin: 0,
								}}>
								Numbers masked for privacy
							</p>
						</div>

						{/* Center: Pointer + Wheel stacked */}
						<div className='flex flex-col items-center shrink-0'>
							<div className='z-20 mb-[-25px] md:mb-[-50px]'>
								<Image
									src='/appDashboard/pin.svg'
									alt='pointer'
									width={80}
									height={69.28}
									className='h-[39.49px] w-[45.6px] md:w-20 md:h-[69.28px]'
								/>
							</div>
							<div className='relative'>
								<div
									ref={containerRef}
									className='w-[320px] h-80 sm:w-[550px] sm:h-[550px] lg:w-[650px] lg:h-[650px] bg-[#0B132A] rounded-full'
								/>

								{/* Stars in outer ring */}
								<div
									className='absolute inset-0 pointer-events-none'
									style={{ width: wheelSize, height: wheelSize }}>
									<WheelStars wheelSize={wheelSize} />
								</div>

								{/* Center circle */}
								<div
									className='absolute pointer-events-none border'
									style={{
										width: wheelSize * 0.07,
										height: wheelSize * 0.07,
										top: '50%',
										left: '50%',
										transform: 'translate(-50%, -50%)',
										borderRadius: '50%',
										backgroundColor: 'white',
										zIndex: 30,
									}}
								/>
							</div>
						</div>

						{/* Right spacer — balances the left ticker */}
						<div
							className='hidden lg:block shrink-0 self-start'
							style={{ width: 250 }}
						/>
					</div>
				</main>

				<footer
					className='px-10 pt-[200px] sm:pt-[330px] lg:pt-[380px] pb-10 flex items-center justify-between bg-cover'
					style={{ backgroundImage: "url('/spin/background.svg')" }}>
					<button
						onClick={handleSpin}
						disabled={isSpinning || !wheelReady}
						className='w-full bg-[#0B132A] text-white font-semibold py-4 rounded-full transition cursor-pointer shadow-[0px_4px_0px_0px_#0B132A] max-w-[280px]'>
						Total Entries: {ALL_NUMBERS.length.toLocaleString()}
					</button>
					<button
						onClick={handleSpin}
						disabled={isSpinning || !wheelReady}
						className={`w-full bg-[#FAAA32] text-black font-semibold py-4 rounded-full transition cursor-pointer shadow-[0px_4px_0px_0px_#0B132A] max-w-[280px]
							${isSpinning || !wheelReady ? 'opacity-60 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-105'}`}>
						{isSpinning ?
							<span
								style={{
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 8,
								}}>
								<span
									style={{
										display: 'inline-block',
										width: 13,
										height: 13,
										border: '2px solid rgba(0,0,0,0.2)',
										borderTopColor: '#000',
										borderRadius: '50%',
										animation: 'spinnerRing 0.65s linear infinite',
									}}
								/>
								Spinning...
							</span>
						:	'Click it'}
					</button>
				</footer>
			</div>
		</>
	);
}
