'use client';

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2, X } from 'lucide-react';
import { maskWinner } from './spinData';

const titleCase = (v) => (v ? v.charAt(0) + v.slice(1).toLowerCase() : '');

export default function WinModal({
	winner,
	onClose,
	onRetry,
	onViewWinners,
	isRealDraw = false,
	drawType,
	totalEntries,
}) {
	const [charIndex, setCharIndex] = useState(0);
	const [revealed, setRevealed] = useState(false);

	// Reveal the number one character at a time
	useEffect(() => {
		if (!winner) return;
		setCharIndex(0);
		setRevealed(false);
		let iv;
		const t = setTimeout(() => {
			let i = 0;
			iv = setInterval(() => {
				i++;
				setCharIndex(i);
				if (i >= winner.length) {
					clearInterval(iv);
					setRevealed(true);
				}
			}, 45);
		}, 400);
		return () => {
			clearTimeout(t);
			clearInterval(iv);
		};
	}, [winner]);

	if (!winner) return null;

	const masked = maskWinner(winner);
	const shown = masked
		.split('')
		.map((ch, i) => (i < charIndex || ch === ' ' ? ch : '•'))
		.join('');

	const details = [
		drawType && `${titleCase(drawType)} draw`,
		typeof totalEntries === 'number' &&
			`${totalEntries.toLocaleString()} ${totalEntries === 1 ? 'entry' : 'entries'}`,
	].filter(Boolean);

	return (
		<div
			className='fixed inset-0 bg-[#0B132A]/60 flex items-center justify-center z-50 p-4'
			style={{ backdropFilter: 'blur(6px)' }}>
			<div
				className='relative bg-white rounded-2xl w-full max-w-[420px] p-6 sm:p-8 text-center shadow-[0px_10px_40px_rgba(11,19,42,0.25)]'
				style={{ animation: 'modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
				<button
					onClick={onClose}
					aria-label='Close'
					className='absolute top-4 right-4 p-1.5 rounded-lg text-[#999999] hover:bg-[#FAFAFA] cursor-pointer'>
					<X size={20} />
				</button>

				<div
					className='mx-auto mb-5 h-16 w-16 rounded-full bg-[#FFF7EB] flex items-center justify-center'
					style={{ animation: 'bounceIn 0.5s 0.1s both' }}>
					<Trophy
						size={30}
						className='text-[#FAAA32]'
					/>
				</div>

				<p className='text-sm font-semibold text-[#FAAA32] mb-1'>
					Winner selected
				</p>
				<h2 className='text-2xl sm:text-[28px] font-bold text-[#1A1A1A] mb-1'>
					Congratulations!
				</h2>
				{details.length > 0 && (
					<p className='text-sm text-[#999999]'>{details.join(' · ')}</p>
				)}

				<div className='mt-6 mb-6 rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] px-5 py-5'>
					<p className='text-xs font-medium text-[#999999] mb-2'>
						Winning number
					</p>
					<p
						className={`text-2xl sm:text-[26px] font-bold tabular-nums tracking-wide min-h-9 transition-colors duration-500 ${
							revealed ? 'text-[#1A1A1A]' : 'text-[#B3B3B3]'
						}`}>
						{revealed ? masked : shown}
					</p>
					<div
						className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#049A04] transition-opacity duration-300 ${
							revealed ? 'opacity-100' : 'opacity-0'
						}`}>
						<CheckCircle2 size={16} />
						{isRealDraw ? 'Recorded by the draw system' : 'Demo result'}
					</div>
				</div>

				<div className='flex flex-col-reverse sm:flex-row gap-3'>
					<button
						onClick={onRetry}
						className='flex-1 py-3 rounded-xl font-semibold border border-[#FAAA32] text-[#FAAA32] bg-white cursor-pointer'>
						{isRealDraw ? 'Back to draws' : 'Spin again'}
					</button>
					<button
						onClick={isRealDraw ? onViewWinners : onClose}
						className='flex-1 py-3 rounded-xl font-bold bg-[#FAAA32] text-[#1A1A1A] cursor-pointer'>
						{isRealDraw ? 'View winners' : 'Done'}
					</button>
				</div>
			</div>
		</div>
	);
}
