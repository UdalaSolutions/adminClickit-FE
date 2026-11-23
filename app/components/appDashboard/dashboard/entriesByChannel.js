'use client';

import { useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts';

const CHANNEL_COLORS = { SMS: '#8979FF', Website: '#FF928A', USSD: '#3CC3DF' };

// Backend: { sms, website, ussd, total, channels: [{ channel, count, percentage }] }
const toChannelData = (entries) => {
	const list = entries?.channels?.length
		? entries.channels
		: entries
			? [
					{ channel: 'SMS', count: entries.sms || 0 },
					{ channel: 'Website', count: entries.website || 0 },
				]
			: [];
	// Show USSD too once it has entries
	if (entries?.ussd > 0 && !list.some((c) => c.channel === 'USSD')) {
		list.push({ channel: 'USSD', count: entries.ussd });
	}
	return list.map((c) => ({
		name: c.channel,
		value: c.count || 0,
		percentage: c.percentage,
		color: CHANNEL_COLORS[c.channel] || '#FAAA32',
	}));
};

const EntryByChannel = ({ entries, loading }) => {
	const channelData = toChannelData(entries);
	const hasData = channelData.some((c) => c.value > 0);

	const EmptyState = () => (
		<div className='h-80 flex items-center justify-center bg-gray-50 rounded-lg'>
			<div className='text-center'>
				<svg
					width='100'
					height='100'
					viewBox='0 0 100 100'
					fill='none'
					className='mx-auto'>
					<rect
						x='15'
						y='60'
						width='20'
						height='30'
						fill='#e5e7eb'
						rx='4'
					/>
					<rect
						x='40'
						y='40'
						width='20'
						height='50'
						fill='#e5e7eb'
						rx='4'
					/>
					<rect
						x='65'
						y='30'
						width='20'
						height='60'
						fill='#e5e7eb'
						rx='4'
					/>
					<line
						x1='10'
						y1='90'
						x2='90'
						y2='90'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
					<line
						x1='10'
						y1='90'
						x2='10'
						y2='20'
						stroke='#d1d5db'
						strokeWidth='2'
					/>
				</svg>
				<h3 className='text-lg font-semibold text-gray-700 mt-4'>
					No entries yet
				</h3>
				<p className='text-sm text-gray-500 mt-2'>
					Entry data by channel will appear here once available
				</p>
			</div>
		</div>
	);

	const CustomTooltip = ({ active, payload }) => {
		if (active && payload && payload.length) {
			return (
				<div className='bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200'>
					<p className='text-sm font-semibold '>{payload[0].payload.name}</p>
					<p className='text-sm text-gray-600'>
						{payload[0].value.toLocaleString()}{' '}
						{payload[0].value === 1 ? 'entry' : 'entries'}
						{typeof payload[0].payload.percentage === 'number'
							? ` · ${payload[0].payload.percentage}%`
							: ''}
					</p>
				</div>
			);
		}
		return null;
	};

	return (
		<div className='bg-white p-4 rounded-xl w-full xl:w-[400px] xl:shrink-0 min-w-0'>
			<div className='flex justify-between items-center mb-6'>
				<h2 className=' font-bold '>Entries by channels</h2>
			</div>


			{loading ? (
				<div className='h-[352px] rounded-lg bg-[#F7F7F7] animate-pulse' />
			) : !hasData ? (
				<EmptyState />
			) : (
				<>
					<ResponsiveContainer
						width='100%'
						height={352}>
						<BarChart data={channelData}>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#f3f4f6'
								vertical={false}
							/>
							<XAxis
								dataKey='name'
								tick={{ fill: '#6b7280', fontSize: 13 }}
								axisLine={{ stroke: '#e5e7eb' }}
								tickLine={false}
							/>
							<YAxis
								tick={{ fill: '#6b7280', fontSize: 12 }}
								axisLine={{ stroke: '#e5e7eb' }}
								tickLine={false}
								allowDecimals={false}
							/>
							<Tooltip
								content={<CustomTooltip />}
								cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
							/>
							<Bar
								dataKey='value'
								maxBarSize={120}>
								{channelData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>

					{/* Legend */}
					<div className='flex items-center justify-center gap-6 mt-4'>
						{channelData.map((channel, index) => (
							<div
								key={index}
								className='flex items-center gap-2'>
								<div
									className='w-3 h-3'
									style={{ backgroundColor: channel.color }}></div>
								<span className='text-sm text-gray-600'>{channel.name}</span>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default EntryByChannel;
