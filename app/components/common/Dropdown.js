'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// App-styled replacement for <select>. options: [{ value, label }]
export default function Dropdown({
	value,
	onChange,
	options = [],
	className = '',
	ariaLabel,
}) {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState(0);
	const rootRef = useRef(null);
	const listId = useId();

	const selectedIndex = Math.max(
		0,
		options.findIndex((o) => o.value === value),
	);
	const selected = options[selectedIndex];

	// Close when clicking outside
	useEffect(() => {
		if (!open) return;
		const onDown = (e) => {
			if (!rootRef.current?.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', onDown);
		return () => document.removeEventListener('mousedown', onDown);
	}, [open]);

	const openList = () => {
		setActive(selectedIndex);
		setOpen(true);
	};

	const choose = (opt) => {
		onChange?.(opt.value);
		setOpen(false);
	};

	const onKeyDown = (e) => {
		if (!open) {
			if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
				e.preventDefault();
				openList();
			}
			return;
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			setOpen(false);
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			setActive((i) => Math.min(options.length - 1, i + 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setActive((i) => Math.max(0, i - 1));
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (options[active]) choose(options[active]);
		} else if (e.key === 'Tab') {
			setOpen(false);
		}
	};

	return (
		<div
			ref={rootRef}
			className={`relative ${className}`}>
			<button
				type='button'
				onClick={() => (open ? setOpen(false) : openList())}
				onKeyDown={onKeyDown}
				aria-haspopup='listbox'
				aria-expanded={open}
				aria-controls={listId}
				aria-label={ariaLabel}
				className={`w-full h-11 pl-4 pr-3 flex items-center justify-between gap-3 bg-white border rounded-xl text-sm font-medium text-[#1A1A1A] cursor-pointer outline-none transition-colors ${
					open ? 'border-[#FAAA32]' : 'border-[#E6E6E6] hover:border-[#FAAA32]'
				}`}>
				<span className='truncate'>{selected?.label}</span>
				<ChevronDown
					size={18}
					className={`text-[#999999] shrink-0 transition-transform duration-200 ${
						open ? 'rotate-180' : ''
					}`}
				/>
			</button>

			{open && (
				<ul
					id={listId}
					role='listbox'
					className='absolute right-0 left-0 top-[calc(100%+6px)] z-40 min-w-full bg-white rounded-xl border border-[#F0F0F0] shadow-[0px_8px_24px_rgba(11,19,42,0.12)] p-1.5'>
					{options.map((opt, i) => {
						const isSelected = opt.value === value;
						return (
							<li
								key={opt.value}
								role='option'
								aria-selected={isSelected}
								onMouseEnter={() => setActive(i)}
								onMouseDown={(e) => e.preventDefault()}
								onClick={() => choose(opt)}
								className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer ${
									i === active ? 'bg-[#FFF7EB]' : ''
								} ${isSelected ? 'text-[#FAAA32] font-semibold' : 'text-[#1A1A1A]'}`}>
								{opt.label}
								{isSelected && (
									<Check
										size={16}
										className='text-[#FAAA32] shrink-0'
									/>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
