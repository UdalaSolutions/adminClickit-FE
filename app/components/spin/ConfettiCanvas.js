'use client';

import { useEffect, useRef } from 'react';

export default function ConfettiCanvas({ active }) {
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
