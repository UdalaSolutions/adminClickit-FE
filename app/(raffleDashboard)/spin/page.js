'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';

const ALL_NUMBERS = [
	'+234 802 345 6789',
	'+234 803 912 4521',
	'+234 701 223 8834',
	'+234 805 678 1102',
	'+234 706 112 9987',
	'+234 809 765 3341',
	'+234 812 998 2256',
	'+234 814 234 7765',
	'+234 816 789 4412',
	'+234 817 123 5598',
	'+234 818 654 3307',
	'+234 909 876 2214',
	'+234 803 441 9923',
	'+234 706 887 1145',
	'+234 810 334 6678',
	'+234 813 220 8891',
	'+234 815 998 2234',
	'+234 811 447 5567',
	'+234 808 763 1189',
	'+234 704 229 4456',
	'+234 906 115 7723',
	'+234 802 558 9934',
	'+234 901 334 6612',
	'+234 812 773 2289',
	'+234 809 116 5578',
	'+234 803 887 1123',
	'+234 816 443 8890',
	'+234 705 229 3367',
	'+234 807 991 4456',
	'+234 814 663 7723',
	'+234 810 228 5589',
	'+234 906 774 2234',
	'+234 811 335 9901',
	'+234 813 449 6678',
	'+234 815 117 3345',
	'+234 817 883 8812',
	'+234 818 226 1189',
	'+234 809 774 4456',
	'+234 802 113 7723',
	'+234 803 889 2290',
	'+234 701 334 5567',
	'+234 805 776 8834',
	'+234 706 112 1101',
	'+234 708 887 4478',
	'+234 810 334 7745',
	'+234 812 116 2212',
	'+234 814 889 5589',
	'+234 816 223 8856',
	'+234 818 445 1123',
	'+234 901 776 4490',
	'+234 906 338 7767',
	'+234 802 991 2234',
	'+234 803 114 5501',
	'+234 805 776 8878',
	'+234 806 222 1145',
	'+234 807 889 4412',
	'+234 809 334 7789',
	'+234 810 447 2256',
	'+234 811 993 5523',
	'+234 812 116 8890',
	'+234 813 448 1167',
	'+234 814 775 4434',
	'+234 815 113 7701',
	'+234 816 887 2278',
	'+234 817 334 5545',
	'+234 818 990 8812',
	'+234 901 113 1189',
	'+234 906 447 4456',
	'+234 802 880 7723',
	'+234 803 334 2290',
	'+234 805 116 5557',
	'+234 806 779 8824',
	'+234 807 333 1191',
	'+234 808 776 4468',
	'+234 809 112 7735',
	'+234 810 889 2202',
	'+234 811 334 5579',
	'+234 812 447 8846',
	'+234 813 993 1113',
	'+234 814 116 4480',
	'+234 815 778 7747',
	'+234 816 334 2214',
	'+234 817 112 5581',
	'+234 818 889 8848',
	'+234 901 334 1115',
	'+234 906 776 4482',
	'+234 802 113 7749',
	'+234 803 887 2216',
	'+234 805 334 5583',
	'+234 806 116 8850',
	'+234 807 779 1117',
	'+234 808 334 4484',
	'+234 809 112 7751',
	'+234 810 889 2218',
	'+234 811 447 5585',
	'+234 812 334 8852',
	'+234 813 116 1119',
	'+234 814 778 4486',
	'+234 815 334 7753',
	'+234 816 992 2220',
	'+234 906 338 7767',
	'+234 802 991 2234',
	'+234 803 114 5501',
	'+234 805 776 8878',
	'+234 806 222 1145',
	'+234 807 889 4412',
	'+234 809 334 7789',
	'+234 810 447 2256',
	'+234 811 993 5523',
	'+234 812 116 8890',
	'+234 813 448 1167',
	'+234 814 775 4434',
	'+234 815 113 7701',
	'+234 816 887 2278',
	'+234 817 334 5545',
	'+234 818 990 8812',
	'+234 901 113 1189',
	'+234 906 447 4456',
	'+234 802 880 7723',
	'+234 803 334 2290',
	'+234 805 116 5557',
	'+234 806 779 8824',
	'+234 807 333 1191',
	'+234 808 776 4468',
	'+234 809 112 7735',
	'+234 810 889 2202',
	'+234 811 334 5579',
	'+234 812 447 8846',
	'+234 813 993 1113',
	'+234 814 116 4480',
	'+234 815 778 7747',
	'+234 816 334 2214',
	'+234 817 112 5581',
	'+234 818 889 8848',
	'+234 901 334 1115',
	'+234 906 776 4482',
	'+234 802 113 7749',
	'+234 803 887 2216',
	'+234 805 334 5583',
	'+234 806 116 8850',
	'+234 807 779 1117',
	'+234 808 334 4484',
	'+234 809 112 7751',
	'+234 810 889 2218',
	'+234 811 447 5585',
	'+234 812 334 8852',
	'+234 813 116 1119',
	'+234 814 778 4486',
	'+234 815 334 7753',
	'+234 816 992 2220',
	'+234 816 992 2220',
];

const WHEEL_SEGMENT_COUNT = 12;
const DISPLAY_COUNT = 20;
const TOTAL_ENTRIES = 151;

function maskNumber(num) {
	if (!num) return '';
	const parts = num.split(' ');
	if (parts.length < 4) return num;
	return `${parts[0]} ${parts[1]} *** ${parts[3].slice(0, 2)}**`;
}

function buildPrizes(nums) {
	return nums.slice(0, WHEEL_SEGMENT_COUNT).map((num, i) => ({
		label: maskNumber(num),
		backgroundColor: i % 2 === 0 ? '#FF875C' : '#FAA95A',
		labelColor: '#4D4D4D',
	}));
}

function Star({ size = 14, color = 'white' }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox='0 0 24 24'
			fill={color}
			xmlns='http://www.w3.org/2000/svg'>
			<path d='M12 2L13.8 8.6H20.6L15 12.8L16.8 19.4L12 15.2L7.2 19.4L9 12.8L3.4 8.6H10.2L12 2Z' />
		</svg>
	);
}

function WheelStars({ wheelSize }) {
	const numStars = 8;
	const innerRadius = (wheelSize / 2) * 0.92;
	const outerRadius = wheelSize / 2;
	const starRadius = (innerRadius + outerRadius) / 2;
	const center = wheelSize / 2;
	const ringThickness = outerRadius - innerRadius;
	const starSize = Math.max(8, Math.round(ringThickness * 0.75));

	return (
		<>
			{Array.from({ length: numStars }).map((_, i) => {
				const angle = (i / numStars) * 2 * Math.PI - Math.PI / 2;
				const x = center + starRadius * Math.cos(angle);
				const y = center + starRadius * Math.sin(angle);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							transform: 'translate(-50%, -50%)',
							pointerEvents: 'none',
							zIndex: 20,
						}}>
						<Star
							size={starSize}
							color='white'
						/>
					</div>
				);
			})}
		</>
	);
}

// ── Confetti ──────────────────────────────────────────────────────────────────
function ConfettiCanvas({ active }) {
	const canvasRef = useRef(null);
	const piecesRef = useRef([]);
	const animRef = useRef(0);
	const idRef = useRef(0);
	const COLORS = [
		'#FAAA32',
		'#f5614e',
		'#FF875C',
		'#FAA95A',
		'#FFD700',
		'#ffffff',
	];

	useEffect(() => {
		if (!active) {
			piecesRef.current = [];
			return;
		}
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const spawn = () => {
			for (let i = 0; i < 10; i++) {
				piecesRef.current.push({
					id: idRef.current++,
					x: Math.random() * canvas.width,
					y: -10,
					color: COLORS[Math.floor(Math.random() * COLORS.length)],
					rotation: Math.random() * 360,
					scale: 0.6 + Math.random() * 1.2,
					vx: (Math.random() - 0.5) * 7,
					vy: 4 + Math.random() * 5,
					shape: ['rect', 'circle', 'triangle'][Math.floor(Math.random() * 3)],
				});
			}
		};
		const interval = setInterval(spawn, 50);

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			piecesRef.current = piecesRef.current.filter(
				(p) => p.y < canvas.height + 20,
			);
			piecesRef.current.forEach((p) => {
				p.x += p.vx;
				p.y += p.vy;
				p.vy += 0.12;
				p.rotation += 4;
				p.vx *= 0.99;
				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate((p.rotation * Math.PI) / 180);
				ctx.scale(p.scale, p.scale);
				ctx.fillStyle = p.color;
				if (p.shape === 'rect') {
					ctx.fillRect(-6, -4, 12, 8);
				} else if (p.shape === 'circle') {
					ctx.beginPath();
					ctx.arc(0, 0, 5, 0, Math.PI * 2);
					ctx.fill();
				} else {
					ctx.beginPath();
					ctx.moveTo(0, -6);
					ctx.lineTo(6, 6);
					ctx.lineTo(-6, 6);
					ctx.closePath();
					ctx.fill();
				}
				ctx.restore();
			});
			animRef.current = requestAnimationFrame(draw);
		};
		animRef.current = requestAnimationFrame(draw);
		return () => {
			clearInterval(interval);
			cancelAnimationFrame(animRef.current);
		};
	}, [active]);

	if (!active) return null;
	return (
		<canvas
			ref={canvasRef}
			style={{
				position: 'fixed',
				inset: 0,
				pointerEvents: 'none',
				zIndex: 100,
			}}
		/>
	);
}

// ── Win Modal ─────────────────────────────────────────────────────────────────
function WinModal({ winner, onClose, onRetry }) {
	const [charIndex, setCharIndex] = useState(0);
	const [revealed, setRevealed] = useState(false);

	useEffect(() => {
		if (!winner) return;
		setCharIndex(0);
		setRevealed(false);
		const t = setTimeout(() => {
			let i = 0;
			const iv = setInterval(() => {
				i++;
				setCharIndex(i);
				if (i >= winner.length) {
					clearInterval(iv);
					setRevealed(true);
				}
			}, 55);
		}, 600);
		return () => clearTimeout(t);
	}, [winner]);

	if (!winner) return null;

	const displayNum = winner
		.split('')
		.map((ch, i) => (i < charIndex ? ch : '•'))
		.join('');

	return (
		<div
			className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
			style={{ backdropFilter: 'blur(8px)' }}>
			<div
				className='bg-white rounded-3xl p-12 text-center shadow-2xl max-w-sm w-[90%]'
				style={{ animation: 'modalPop 0.45s cubic-bezier(0.34,1.56,0.64,1)' }}>
				<div
					style={{
						fontSize: 56,
						marginBottom: 8,
						animation: 'bounceIn 0.5s 0.15s both',
					}}>
					🎉
				</div>

				<p
					style={{
						color: '#FAAA32',
						fontSize: 11,
						fontWeight: 800,
						letterSpacing: '0.2em',
						textTransform: 'uppercase',
						margin: '0 0 6px',
					}}>
					We have a winner!
				</p>
				<h2 className='text-3xl font-bold text-gray-900 mb-2'>
					Congratulations! 🏆
				</h2>
				<p className='text-gray-500 text-sm mb-7'>
					The raffle wheel has selected a winner
				</p>

				<div
					style={{
						background: 'linear-gradient(135deg, #fff7ed, #fff3e0)',
						border: '2px solid #FAAA32',
						borderRadius: 20,
						padding: '20px 24px',
						marginBottom: 28,
					}}>
					<p
						style={{
							color: '#9ca3af',
							fontSize: 11,
							fontWeight: 700,
							letterSpacing: '0.15em',
							textTransform: 'uppercase',
							margin: '0 0 10px',
						}}>
						Winning Number
					</p>
					<p
						style={{
							color: revealed ? '#f5614e' : '#0B132A',
							fontSize: 22,
							fontWeight: 800,
							fontFamily: 'monospace',
							letterSpacing: '0.08em',
							transition: 'color 0.5s',
							minHeight: 32,
							margin: 0,
						}}>
						{revealed ? winner : displayNum}
					</p>
					{revealed && (
						<div
							style={{
								marginTop: 10,
								display: 'inline-flex',
								alignItems: 'center',
								gap: 6,
								background: '#dcfce7',
								color: '#16a34a',
								fontSize: 12,
								fontWeight: 700,
								borderRadius: 20,
								padding: '4px 14px',
							}}>
							✓ Verified winner
						</div>
					)}
				</div>

				<div className='flex gap-3'>
					<button
						onClick={onRetry}
						className='flex-1 rounded-full py-3.5 font-bold text-sm cursor-pointer'
						style={{
							border: '2px solid #e5e7eb',
							background: 'transparent',
							color: '#374151',
						}}>
						New Draw
					</button>
					<button
						onClick={onClose}
						className='rounded-full py-3.5 font-bold text-sm cursor-pointer text-white hover:scale-105 transition-transform'
						style={{
							flex: 2,
							background: 'linear-gradient(135deg, #FAAA32, #f5614e)',
							border: 'none',
							boxShadow: '0 6px 24px rgba(250,170,50,0.45)',
						}}>
						Claim Prize 🎁
					</button>
				</div>
			</div>
		</div>
	);
}

// ── Number Ticker ─────────────────────────────────────────────────────────────
// Accepts displayNums + setDisplayNums from parent so wheel stays in sync
function NumberTicker({
	displayNums,
	pulsingIndex,
	isSpinning,
	winnerIndex,
	hasSpun,
}) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
			{displayNums.map((num, i) => {
				const isWinner =
					hasSpun &&
					!isSpinning &&
					winnerIndex !== null &&
					num === ALL_NUMBERS[winnerIndex];
				const isPulsing = pulsingIndex === i && isSpinning;
				return (
					<div
						key={i}
						style={{
							background:
								isWinner ? '#fff7ed'
								: isPulsing ? '#fff8f0'
								: '#f9fafb',
							border: `1.5px solid ${
								isWinner ? '#FAAA32'
								: isPulsing ? '#FAA95A'
								: '#f3f4f6'
							}`,
							borderRadius: 8,
							padding: '9px 12px',
							display: 'flex',
							alignItems: 'center',
							gap: 7,
							transition: isPulsing ? 'none' : 'all 0.2s',
							transform: isPulsing ? 'scale(1.04)' : 'scale(1)',
						}}>
						<div
							style={{
								width: 7,
								height: 7,
								borderRadius: '50%',
								flexShrink: 0,
								background:
									isWinner ? '#f5614e'
									: isPulsing ? '#FAAA32'
									: '#d1d5db',
								boxShadow:
									isWinner ? '0 0 5px #f5614e'
									: isPulsing ? '0 0 4px #FAAA32'
									: 'none',
							}}
						/>
						<span
							style={{
								color: isWinner ? '#f5614e' : '#374151',
								fontSize: 11,
								fontFamily: 'monospace',
								fontWeight: isWinner ? 800 : 400,
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}>
							{maskNumber(num)}
						</span>
					</div>
				);
			})}
		</div>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SpinPage() {
	const containerRef = useRef(null);
	const wheelRef = useRef(null);

	const [isSpinning, setIsSpinning] = useState(false);
	const [winner, setWinner] = useState(null);
	const [winnerIndex, setWinnerIndex] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [showConfetti, setShowConfetti] = useState(false);
	const [hasSpun, setHasSpun] = useState(false);
	const [wheelSize, setWheelSize] = useState(320);
	const [wheelReady, setWheelReady] = useState(false);

	// Shared state: both ticker AND wheel read from this
	const [displayNums, setDisplayNums] = useState(
		ALL_NUMBERS.slice(0, DISPLAY_COUNT),
	);
	const [pulsingIndex, setPulsingIndex] = useState(null);

	// Track window size for stars
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
		import('spin-wheel').then(({ Wheel }) => {
			if (!containerRef.current) return;

			const wheel = new Wheel(containerRef.current, {
				items: buildPrizes(ALL_NUMBERS),
				itemLabelFont: 'Inter, serif',
				itemLabelFontSizeMax: 16,
				itemLabelRadius: 0.82,
				itemLabelRadiusMax: 0.2,
				itemLabelRotation: 180,
				itemLabelAlign: 'left',
				itemLabelColors: ['#fff'],
				lineColor: 'transparent',
				lineWidth: 0,
				borderColor: 'transparent',
				borderWidth: 0,
				radius: 0.92,
				rotationResistance: -20,
				isInteractive: false,
				pointerAngle: 0,

				onRest: (event) => {
					const idx = event.currentIndex;
					// The winning number is whichever num is currently at that wheel slot
					setWinnerIndex(idx);
					setWinner(null); // will be resolved from displayNums snapshot in interval cleanup
					setIsSpinning(false);
					setHasSpun(true);
				},
			});

			wheelRef.current = wheel;
			setWheelReady(true);
		});

		return () => {
			if (wheelRef.current) {
				wheelRef.current.remove();
				wheelRef.current = null;
			}
		};
	}, []);

	// Spin interval — updates displayNums AND wheel items in sync
	const intervalRef = useRef(null);
	const slotRef = useRef(0);
	const winnerNumRef = useRef(null); // store winner number across the async gap

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

					// Also update wheel items to match the first 8 of updated list
					if (wheelRef.current) {
						const updatedItems = buildPrizes(next);
						wheelRef.current.items = updatedItems;
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
				// Settle: put the winner in the grid and reveal
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

				// Small delay so state settles before reading winnerNumRef
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

				<main className='flex-1 flex flex-col items-center justify-center relative overflow-hidden pb-16'>
					{/* Pointer — exactly as original */}
					<div className='z-20 mb-[-25px] md:mb-[-50px]'>
						<Image
							src='/appDashboard/pin.svg'
							alt='pointer'
							width={80}
							height={69.28}
							className='h-[39.49px] w-[45.6px] md:w-20 md:h-[69.28px]'
						/>
					</div>

					{/* Three-column: ticker | wheel | stats */}
					<div className='flex items-start justify-center gap-8 w-full px-4'>
						{/* Left: Entry pool ticker */}
						<div
							className='hidden lg:flex flex-col gap-3 pt-14 shrink-0'
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
								winnerIndex={winnerIndex}
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

						{/* Center: Wheel */}
						<div className='relative shrink-0 ml-12'>
							<div
								ref={containerRef}
								className='w-[320px] h-80 sm:w-[550px] sm:h-[550px] bg-[#f5614e] rounded-full'
							/>

							{/* Stars in orange ring */}
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

						{/* Right: Stats */}
						<div
							className='hidden lg:flex flex-col gap-3 pt-14 shrink-0'
							style={{ width: 250 }}>
							<div
								style={{
									background: '#fff7ed',
									border: '1.5px solid #FAA95A',
									borderRadius: 16,
									padding: '18px 20px',
								}}>
								<p
									style={{
										color: '#9ca3af',
										fontSize: 11,
										fontWeight: 700,
										letterSpacing: '0.12em',
										textTransform: 'uppercase',
										margin: '0 0 6px',
									}}>
									Total Entries
								</p>
								<p
									style={{
										color: '#f5614e',
										fontSize: 32,
										fontWeight: 800,
										lineHeight: 1,
										margin: 0,
									}}>
									{TOTAL_ENTRIES.toLocaleString()}
								</p>
								<p
									style={{ color: '#d1d5db', fontSize: 12, margin: '4px 0 0' }}>
									participants registered
								</p>
							</div>

							<div
								style={{
									background: '#f9fafb',
									border: '1.5px solid #f3f4f6',
									borderRadius: 16,
									padding: '18px 20px',
								}}>
								<p
									style={{
										color: '#9ca3af',
										fontSize: 11,
										fontWeight: 700,
										letterSpacing: '0.12em',
										textTransform: 'uppercase',
										margin: '0 0 10px',
									}}>
									Draw Status
								</p>
								<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
									<div
										style={{
											width: 9,
											height: 9,
											borderRadius: '50%',
											background:
												isSpinning ? '#f5614e'
												: hasSpun ? '#22c55e'
												: '#FAAA32',
											boxShadow: `0 0 8px ${
												isSpinning ? '#f5614e'
												: hasSpun ? '#22c55e'
												: '#FAAA32'
											}`,
										}}
									/>
									<span
										style={{ color: '#374151', fontSize: 13, fontWeight: 600 }}>
										{isSpinning ?
											'Drawing...'
										: hasSpun ?
											'Winner picked'
										:	'Ready'}
									</span>
								</div>
							</div>

							<div
								style={{
									background: '#f9fafb',
									border: '1.5px solid #f3f4f6',
									borderRadius: 16,
									padding: '18px 20px',
								}}>
								<p
									style={{
										color: '#9ca3af',
										fontSize: 11,
										fontWeight: 700,
										letterSpacing: '0.12em',
										textTransform: 'uppercase',
										margin: '0 0 8px',
									}}>
									Pool Size
								</p>
								<p
									style={{
										color: '#374151',
										fontSize: 22,
										fontWeight: 800,
										margin: 0,
									}}>
									{ALL_NUMBERS.length}
								</p>
								<p
									style={{ color: '#d1d5db', fontSize: 12, margin: '2px 0 0' }}>
									eligible numbers
								</p>
							</div>
						</div>
					</div>
					<button
						onClick={handleSpin}
						disabled={isSpinning || !wheelReady}
						className={`mt-12 w-full bg-[#FAAA32] text-black font-semibold py-4 rounded-full transition cursor-pointer shadow-[0px_4px_0px_0px_#0B132A] max-w-[280px]
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
						:	'Spin'}
					</button>
				</main>

				{/* Footer — original */}
				<footer
					className='p-10 py-32 flex items-center justify-between bg-cover bg-center'
					style={{ backgroundImage: "url('/spin/background.svg')" }}></footer>
			</div>
		</>
	);
}
