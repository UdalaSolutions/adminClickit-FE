'use client';

import { maskNumber } from './spinData';

export default function NumberTicker({
	displayNums,
	pulsingIndex,
	isSpinning,
	winner,
	hasSpun,
}) {
	return (
		<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
			{displayNums.map((num, i) => {
				const isWinner =
					hasSpun && !isSpinning && winner !== null && num === winner;
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
