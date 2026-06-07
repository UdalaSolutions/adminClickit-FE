'use client';

import Image from 'next/image';

export default function LoadingScreen({ visible }) {
	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				background: '#ffffff',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 300,
				opacity: visible ? 1 : 0,
				pointerEvents: visible ? 'all' : 'none',
				transition: 'opacity 0.7s ease',
			}}>
			<Image
				src='/appDashboard/clickit-logo.svg'
				alt='logo'
				width={163}
				height={50}
				style={{ marginBottom: 40 }}
			/>
			{/* Animated wheel rings */}
			<div
				style={{
					position: 'relative',
					width: 80,
					height: 80,
					marginBottom: 28,
				}}>
				<div
					style={{
						position: 'absolute',
						inset: 0,
						borderRadius: '50%',
						border: '4px solid #FAA95A',
						borderTopColor: '#f5614e',
						animation: 'spinnerRing 0.9s linear infinite',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						inset: 12,
						borderRadius: '50%',
						border: '4px solid #FAAA32',
						borderTopColor: '#FF875C',
						animation: 'spinnerRing 0.7s linear infinite reverse',
					}}
				/>
				<div
					style={{
						position: 'absolute',
						inset: 24,
						borderRadius: '50%',
						background: '#f5614e',
					}}
				/>
			</div>
			<p
				style={{
					color: '#9ca3af',
					fontSize: 13,
					fontWeight: 600,
					letterSpacing: '0.06em',
				}}>
				Loading raffle wheel…
			</p>
		</div>
	);
}
