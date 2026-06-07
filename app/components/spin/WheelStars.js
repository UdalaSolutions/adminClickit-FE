'use client';

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

export default function WheelStars({ wheelSize }) {
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
