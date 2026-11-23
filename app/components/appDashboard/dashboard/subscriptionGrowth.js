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

const SubscriptionGrowth = () => {
	const [period, setPeriod] = useState('weekly');
	const [hasData, setHasData] = useState(true);

	const dailyData = [
		{ name: 'Mon', daily: 3500, weekly: 4200, monthly: 2300 },
		{ name: 'Tue', daily: 4100, weekly: 3800, monthly: 1900 },
		{ name: 'Wed', daily: 4300, weekly: 2800, monthly: 1500 },
		{ name: 'Thurs', daily: 3100, weekly: 5100, monthly: 2400 },
		{ name: 'Fri', daily: 2600, weekly: 5200, monthly: 2500 },
		{ name: 'Sat', daily: 3300, weekly: 4100, monthly: 2300 },
		{ name: 'Sun', daily: 3600, weekly: 3800, monthly: 1800 },
	];

	const weeklyData = [
		{ name: 'Week 1', daily: 7000, weekly: 20000, monthly: 23000 },
		{ name: 'Week 2', daily: 10000, weekly: 15000, monthly: 24000 },
		{ name: 'Week 3', daily: 5000, weekly: 11000, monthly: 25000 },
		{ name: 'Week 4', daily: 6000, weekly: 13000, monthly: 19000 },
	];

	const monthlyData = [
		{ name: 'Jan', daily: 15000, weekly: 40000, monthly: 55000 },
		{ name: 'Feb', daily: 18000, weekly: 45000, monthly: 60000 },
		{ name: 'Mar', daily: 22000, weekly: 50000, monthly: 65000 },
		{ name: 'Apr', daily: 20000, weekly: 48000, monthly: 62000 },
		{ name: 'May', daily: 25000, weekly: 55000, monthly: 70000 },
		{ name: 'Jun', daily: 23000, weekly: 52000, monthly: 68000 },
	];

	const getChartData = () => {
		switch (period) {
			case 'daily':
				return dailyData;
			case 'monthly':
				return monthlyData;
			default:
				return weeklyData;
		}
	};

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
						onClick={() => setPeriod('daily')}
						className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all cursor-pointer relative text-subText`}>
						<span className='w-2 h-2 rounded-full border border-[#8979FF] bg-white relative z-20 top-0'></span>
						<span className='absolute w-4 h-0.5 bg-[#8979FF] z-10 left-1'></span>
						Daily
					</button>
					<button
						onClick={() => setPeriod('weekly')}
						className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all cursor-pointer relative text-subText`}>
						<span className='w-2 h-2 rounded-full border border-[#FF928A] bg-white relative z-20 top-0 '></span>
						<span className='absolute w-4 h-0.5 bg-[#FF928A] z-10 left-1'></span>
						Weekly
					</button>
					<button
						onClick={() => setPeriod('monthly')}
						className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-all cursor-pointer relative text-subText`}>
						<span className='w-2 h-2 rounded-full border border-[#3CC3DF] bg-white relative z-20 top-0'></span>
						<span className='absolute w-4 h-0.5 bg-[#3CC3DF] z-10 left-1'></span>
						Monthly
					</button>
				</div>
			</div>


			{!hasData ? (
				<h1>Hello empty</h1>
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
							tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
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
							stroke='#8b5cf6'
							strokeWidth={2.5}
							fill='url(#colorDaily)'
							dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4, stroke: 'white' }}
							activeDot={{ r: 6 }}
						/>
						<Area
							type='monotone'
							dataKey='weekly'
							stroke='#ec4899'
							strokeWidth={2.5}
							fill='url(#colorWeekly)'
							dot={{ fill: '#ec4899', strokeWidth: 2, r: 4, stroke: 'white' }}
							activeDot={{ r: 6 }}
						/>
						<Area
							type='monotone'
							dataKey='monthly'
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
