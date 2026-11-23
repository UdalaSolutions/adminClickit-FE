'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { spacedPhone } from '../../utils/format';

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

// Repeat a list until it has at least `n` items (the wheel needs 12+ segments)
const fillTo = (list, n) => {
	if (!list.length) return [];
	const out = [];
	while (out.length < n) out.push(...list);
	return out;
};

// The backend may return the draw as `data` or as `data.draw`
const unwrapDraw = (json) => json?.data?.draw || json?.data || null;

const pickWinnerPhone = (json) => {
	const d = json?.data;
	if (typeof d === 'string' && /^\+?\d{10,}$/.test(d.trim())) return d.trim();
	return (
		d?.winnerPhoneNumber || d?.draw?.winnerPhoneNumber || d?.phoneNumber || null
	);
};

export default function SpinPage() {
	const containerRef = useRef(null);
	const wheelRef = useRef(null);

	// Real draw (from ?drawId=) — falls back to demo numbers when absent
	const drawIdRef = useRef(null);
	const poolRef = useRef(ALL_NUMBERS);
	const backendWinnerRef = useRef(null);
	const [totalEntries, setTotalEntries] = useState(ALL_NUMBERS.length);
	const [drawInfo, setDrawInfo] = useState(null);
	const [drawError, setDrawError] = useState('');
	const [isExecuting, setIsExecuting] = useState(false);
	const [executed, setExecuted] = useState(false); // real draw already run this visit

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
		// React dev mode runs effects twice; this stops a second wheel being drawn
		let cancelled = false;
		const minDelay = new Promise((r) => setTimeout(r, 5000));

		const drawId = new URLSearchParams(window.location.search).get('drawId');
		drawIdRef.current = drawId;

		// Draw can't run -> go straight back to Draw management with the reason
		const BAIL = Symbol('bail');
		const bail = (msg) => {
			if (!cancelled) {
				try {
					sessionStorage.setItem('drawError', msg);
				} catch {}
				window.location.replace('/draw-management');
			}
			throw BAIL;
		};

		// GET /api/user/draw/get/{drawId} -> participants become the wheel numbers
		const loadDraw = drawId
			? api
					.get(`/api/user/draw/get/${drawId}`)
					.catch((err) => bail(err.message || 'Could not load this draw.'))
					.then((json) => {
						const draw = unwrapDraw(json);
						const entries = (draw?.participants || [])
							.map((p) => p.phoneNumber)
							.filter(Boolean)
							.map(spacedPhone);
						if (draw?.status === 'COMPLETED') {
							bail('This draw has already been executed.');
						}
						if (!entries.length) {
							bail('This draw has no participants yet, so it cannot be run.');
						}
						setDrawInfo(draw);
						setTotalEntries(entries.length);
						const unique = [...new Set(entries)];
						poolRef.current = fillTo(unique, DISPLAY_COUNT);
						setDisplayNums(poolRef.current.slice(0, DISPLAY_COUNT));
					})
			: Promise.resolve();

		Promise.all([import('spin-wheel'), minDelay, loadDraw])
			.then(([{ Wheel }]) => {
				if (cancelled) return;
				if (!containerRef.current) {
					setIsLoading(false);
					return;
				}

				const wheel = new Wheel(containerRef.current, {
					items: buildPrizes(
						poolRef.current.length ? poolRef.current : ALL_NUMBERS,
					),
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
			.catch((e) => {
				// On BAIL the page is already redirecting — keep the loader up
				if (e !== BAIL && !cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
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
				const pool = poolRef.current.length ? poolRef.current : ALL_NUMBERS;
				const newNum = pool[Math.floor(Math.random() * pool.length)];

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
					// Real draws: the backend picked the winner — show it under the pointer
					const winningNum =
						backendWinnerRef.current ??
						prev[winnerIndex] ??
						ALL_NUMBERS[winnerIndex];
					winnerNumRef.current = winningNum;

					const next = [...prev];
					next[winnerIndex] = winningNum;
					if (wheelRef.current) wheelRef.current.items = buildPrizes(next);
					return next;
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

	const handleSpin = useCallback(async () => {
		if (isSpinning || isExecuting || executed || !wheelRef.current || !wheelReady) return;
		if (drawError) return toast.error(drawError);

		const drawId = drawIdRef.current;
		if (drawId) {
			// POST /api/user/draw/execute/{drawId} — backend chooses the winner
			setIsExecuting(true);
			try {
				const res = await api.post(`/api/user/draw/execute/${drawId}`);
				let phone = pickWinnerPhone(res);
				if (!phone) {
					const fresh = await api.get(`/api/user/draw/get/${drawId}`);
					phone = unwrapDraw(fresh)?.winnerPhoneNumber || null;
				}
				if (!phone) {
					toast.error('Draw executed, but the backend did not return a winner.');
					return;
				}
				backendWinnerRef.current = spacedPhone(phone);
				setExecuted(true);
			} catch (err) {
				// e.g. "Cannot execute draw: There are no participants."
				toast.error(err.message || 'Failed to execute draw');
				return;
			} finally {
				setIsExecuting(false);
			}
		}

		const idx = Math.floor(Math.random() * WHEEL_SEGMENT_COUNT);
		setIsSpinning(true);
		setShowModal(false);
		setWinner(null);
		setWinnerIndex(null);
		setHasSpun(false);
		wheelRef.current.spinToItem(idx, 7000, true, 3, 1);
	}, [isSpinning, isExecuting, executed, wheelReady, drawError]);

	const handleNewDraw = () => {
		// A real draw can only run once — go back to manage draws
		if (drawIdRef.current) {
			window.location.href = '/draw-management';
			return;
		}
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
					onViewWinners={() => (window.location.href = '/winners')}
					isRealDraw={!!drawIdRef.current}
					drawType={drawInfo?.drawType}
					totalEntries={totalEntries}
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
					<Link
						href='/draw-management'
						className='bg-[#FAAA321A] flex items-center gap-2 text-[#FAAA32] font-semibold rounded-[50px] py-3 px-6'>
						<ArrowLeft size={20} /> Draws
					</Link>
				</header>

				{drawInfo && (
					<p className='text-center text-sm text-[#999999] -mt-2'>
						{drawInfo.drawType
							? drawInfo.drawType.charAt(0) +
								drawInfo.drawType.slice(1).toLowerCase()
							: ''}{' '}
						draw
					</p>
				)}
				{drawError && !isLoading && !showModal && (
					<div className='mx-auto mt-3 px-4 py-2 rounded-lg bg-[#F20D0D0F] text-[#F20D0D] text-sm text-center max-w-md'>
						{drawError}{' '}
						<Link
							href='/draw-management'
							className='underline font-medium'>
							Back to draws
						</Link>
					</div>
				)}

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
						Total Entries: {totalEntries.toLocaleString()}
					</button>
					<button
						onClick={handleSpin}
						disabled={isSpinning || isExecuting || executed || !wheelReady || !!drawError}
						className={`w-full bg-[#FAAA32] text-black font-semibold py-4 rounded-full transition cursor-pointer shadow-[0px_4px_0px_0px_#0B132A] max-w-[280px]
							${isSpinning || isExecuting || executed || !wheelReady || drawError ? 'opacity-60 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-105'}`}>
						{isExecuting ?
							'Picking winner...'
						: isSpinning ?
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
