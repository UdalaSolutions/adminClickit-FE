'use client';

import { useState, useEffect } from 'react';
import { maskWinner } from './spinData';

export default function WinModal({ winner, onClose, onRetry }) {
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

	const maskedWinner = maskWinner(winner);
	const displayNum = maskedWinner
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
						{revealed ? maskedWinner : displayNum}
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
