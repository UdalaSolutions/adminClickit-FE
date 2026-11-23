'use client';

import { useState } from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';

// Backend points: [{ period: 'Week 1', daily, weekly, monthly, total }]
const toChartData = (growth) =>
	(growth?.points || []).map((p) => ({
		name: p.period,
		daily: p.daily || 0,
		weekly: p.weekly || 0,
		monthly: p.monthly || 0,
	}));

const formatTick = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v);

const SubscriptionGrowth = ({ growth, loading }) => {
	// Legend buttons show/hide each line
	const [hidden, setHidden] = useState({});
	const toggle = (key) => setHidden((h) => ({ ...h, [key]: !h[key] }));

	const chartData = toChartData(growth);
	const hasData = chartData.length > 0;
	const getChartData = () => chartData;

	const EmptyState = () => (
		<div className='h-96 flex items-center justify-center bg-gray-50 rounded-lg'>
			<div className='text-center'>
				<svg
					width='120'
					height='120'
					viewBox='0 0 120 120'
					fill='none'
					className='mx-auto'>
					<rect
						x='10'
						y='80'
						width='100'
						height='30'
						fill='#e5e7eb'
						rx='4'
					/>
					<line
						x1='20'
						y1='75'
						x2='20'
						y2='15'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
					<line
						x1='40'
						y1='75'
						x2='40'
						y2='35'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
					<line
						x1='60'
						y1='75'
						x2='60'
						y2='25'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
					<line
						x1='80'
						y1='75'
						x2='80'
						y2='45'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
					<line
						x1='100'
						y1='75'
						x2='100'
						y2='30'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
				</svg>
				<h3 className='text-lg font-semibold text-gray-700 mt-4'>
					No data available
				</h3>
				<p className='text-sm text-gray-500 mt-2'>
					Subscription growth data will appear here once available
				</p>
			</div>
		</div>
	);

	return (
		<div className='bg-white p-4 rounded-xl flex-1 min-w-0'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='font-bold'>Subscription growth</h2>

				<div className='flex items-center gap-1'>
					<button
						onClick={() => toggle('daily')}
						aria-pressed={!hidden.daily}
						className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all cursor-pointer relative text-subText ${hidden.daily ? 'opacity-40 line-through' : ''}`}>
						<span className='w-2 h-2 rounded-full border border-[#8979FF] bg-white relative z-20 top-0'></span>
						<span className='absolute w-4 h-0.5 bg-[#8979FF] z-10 left-1'></span>
						Daily
					</button>
					<button
						onClick={() => toggle('weekly')}
						aria-pressed={!hidden.weekly}
						className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all cursor-pointer relative text-subText ${hidden.weekly ? 'opacity-40 line-through' : ''}`}>
						<span className='w-2 h-2 rounded-full border border-[#FF928A] bg-white relative z-20 top-0 '></span>
						<span className='absolute w-4 h-0.5 bg-[#FF928A] z-10 left-1'></span>
						Weekly
					</button>
					<button
						onClick={() => toggle('monthly')}
						aria-pressed={!hidden.monthly}
						className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all cursor-pointer relative text-subText ${hidden.monthly ? 'opacity-40 line-through' : ''}`}>
						<span className='w-2 h-2 rounded-full border border-[#3CC3DF] bg-white relative z-20 top-0'></span>
						<span className='absolute w-4 h-0.5 bg-[#3CC3DF] z-10 left-1'></span>
						Monthly
					</button>
				</div>
			</div>


			{loading ? (
				<div className='h-[400px] rounded-lg bg-[#F7F7F7] animate-pulse' />
			) : !hasData ? (
				<EmptyState />
			) : (
				<ResponsiveContainer
					width='100%'
					height={400}>
					<AreaChart data={getChartData()}>
						<defs>
							<linearGradient
								id='colorDaily'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='5%'
									stopColor='#8b5cf6'
									stopOpacity={0.3}
								/>
								<stop
									offset='95%'
									stopColor='#8b5cf6'
									stopOpacity={0.05}
								/>
							</linearGradient>
							<linearGradient
								id='colorWeekly'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='5%'
									stopColor='#ec4899'
									stopOpacity={0.3}
								/>
								<stop
									offset='95%'
									stopColor='#ec4899'
									stopOpacity={0.05}
								/>
							</linearGradient>
							<linearGradient
								id='colorMonthly'
								x1='0'
								y1='0'
								x2='0'
								y2='1'>
								<stop
									offset='5%'
									stopColor='#06b6d4'
									stopOpacity={0.3}
								/>
								<stop
									offset='95%'
									stopColor='#06b6d4'
									stopOpacity={0.05}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray='3 3'
							stroke='#f3f4f6'
							vertical={false}
						/>
						<XAxis
							dataKey='name'
							tick={{ fill: '#6b7280', fontSize: 12 }}
							axisLine={{ stroke: '#e5e7eb' }}
							tickLine={false}
						/>
						<YAxis
							tick={{ fill: '#6b7280', fontSize: 12 }}
							axisLine={{ stroke: '#e5e7eb' }}
							tickLine={false}
							tickFormatter={formatTick}
							allowDecimals={false}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: 'white',
								border: '1px solid #e5e7eb',
								borderRadius: 8,
								boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
							}}
							formatter={(value) => [value.toLocaleString(), '']}
						/>
						<Area
							type='monotone'
							dataKey='daily'
							hide={!!hidden.daily}
							stroke='#8b5cf6'
							strokeWidth={2.5}
							fill='url(#colorDaily)'
							dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4, stroke: 'white' }}
							activeDot={{ r: 6 }}
						/>
						<Area
							type='monotone'
							dataKey='weekly'
							hide={!!hidden.weekly}
							stroke='#ec4899'
							strokeWidth={2.5}
							fill='url(#colorWeekly)'
							dot={{ fill: '#ec4899', strokeWidth: 2, r: 4, stroke: 'white' }}
							activeDot={{ r: 6 }}
						/>
						<Area
							type='monotone'
							dataKey='monthly'
							hide={!!hidden.monthly}
							stroke='#06b6d4'
							strokeWidth={2.5}
							fill='url(#colorMonthly)'
							dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4, stroke: 'white' }}
							activeDot={{ r: 6 }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</div>
	);
};

export default SubscriptionGrowth;
