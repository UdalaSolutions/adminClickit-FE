'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import Dropdown from '../../common/Dropdown';

// Turns the backend's overview block into the four cards
const buildCards = (o = {}) => {
	const stat = (s, label, valueKey) => ({
		label: s?.title || label,
		figure: s?.[valueKey] ?? '0',
		subtext: s?.comparisonText || '',
		trend: s ? (s.trend === 'DOWN' ? 'down' : 'up') : 'none',
		positive: s?.positive,
	});
	return [
		stat(o.activeSubscribers, 'Active subscribers', 'formattedValue'),
		stat(o.newSubscribers, 'New subscribers', 'formattedValue'),
		stat(o.revenueGenerated, 'Revenue generated', 'formattedAmount'),
		{
			label: o.totalPayouts?.title || 'Total payouts',
			figure: o.totalPayouts?.formattedAmount ?? '₦0',
			subtext: o.totalPayouts?.pendingText || '',
			trend: o.totalPayouts?.pendingCount > 0 ? 'pending' : 'none',
		},
	];
};

const Overview = ({ overview, period = 'WEEKLY', onPeriodChange, loading }) => {
	const cards = buildCards(overview);

	return (
		<section className='space-y-4'>
			<div className='flex justify-between items-center'>
				<h1 className='font-bold text-xl'>Overview</h1>

				{/* Period filter — refetches /api/dashboard */}
				<Dropdown
					value={period}
					onChange={(v) => onPeriodChange?.(v)}
					ariaLabel='Dashboard period'
					className='w-36'
					options={[
						{ value: 'DAILY', label: 'Daily' },
						{ value: 'WEEKLY', label: 'Weekly' },
						{ value: 'MONTHLY', label: 'Monthly' },
					]}
				/>
			</div>

			<div className='grid sm:grid-cols-2 xl:grid-cols-4 gap-4'>
				{cards.map((card) => (
					<div
						key={card.label}
						className='bg-white p-5 rounded-xl border border-gray-100 flex flex-col gap-4'>
						<p className='text-gray-600 text-sm font-medium'>{card.label}</p>

						{loading ? (
							<div className='animate-pulse space-y-4'>
								<div className='h-8 w-28 rounded-lg bg-[#F0F0F0]' />
								<div className='h-3.5 w-32 rounded-full bg-[#F0F0F0]' />
							</div>
						) : (
							<>
								<h1 className='text-gray-900 font-bold text-3xl leading-9'>
									{card.figure}
								</h1>

								<div className='flex items-center gap-1.5 min-h-5'>
									{card.trend === 'up' && (
										<>
											<ArrowUp
												className={`w-4 h-4 ${card.positive === false ? 'text-[#F20D0D]' : 'text-[#049A04]'}`}
											/>
											<span
												className={`text-sm font-medium ${card.positive === false ? 'text-[#F20D0D]' : 'text-[#049A04]'}`}>
												{card.subtext}
											</span>
										</>
									)}
									{card.trend === 'down' && (
										<>
											<ArrowDown className='w-4 h-4 text-[#F20D0D]' />
											<span className='text-sm text-[#F20D0D] font-medium'>
												{card.subtext}
											</span>
										</>
									)}
									{card.trend === 'pending' && (
										<span className='text-sm text-[#F20D0D] font-medium'>
											{card.subtext}
										</span>
									)}
									{card.trend === 'none' && card.subtext && (
										<span className='text-sm text-[#999999]'>{card.subtext}</span>
									)}
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</section>
	);
};

export default Overview;
