'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TotalEntries = () => {
	// Set hasData to false to see empty state with 0
	const [hasData] = useState(true);

	// Sample data
	const drawData = [
		{ name: 'Weekly draw', value: 4, color: '#FAAA32' },
		{ name: 'Monthly draw', value: 2, color: '#0B132A' },
	];

	const emptyData = [
		{ name: 'Weekly draw', value: 0, color: '#FAAA32' },
		{ name: 'Monthly draw', value: 0, color: '#0B132A' },
	];

	const chartData = hasData ? drawData : emptyData;
	const totalDraws = chartData.reduce((acc, item) => acc + item.value, 0);

	return (
		<div className='bg-white p-4 rounded-xl min-w-[350px]'>
			<h2 className='font-bold mb-3'>Total draws conducted</h2>

			<div className='flex flex-col items-center'>
				{/* Donut Chart */}
				<div className='relative  w-[200px] h-[200px]'>
					<ResponsiveContainer
						width='100%'
						height='100%'>
						<PieChart>
							<Pie
								data={chartData}
								cx='50%'
								cy='50%'
								innerRadius={70}
								outerRadius={100}
								paddingAngle={0}
								dataKey='value'
								startAngle={-270}
								endAngle={90}>
								{chartData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>

					{/* Center Text */}
					<div className='absolute inset-0 flex items-center justify-center'>
						<span className='text-[27px] leading-[41px]  font-semibold '>
							{totalDraws}
						</span>
					</div>
				</div>

				{/* Legend */}
				<div className='mt-2 space-y-3 w-full'>
					{chartData.map((item, index) => (
						<div
							key={index}
							className='flex items-center justify-between'>
							<div className='flex items-center gap-2'>
								<div
									className='w-2.5 h-2.5 rounded-full'
									style={{ backgroundColor: item.color }}></div>
								<span className='text-sm text-gray-700'>{item.name}</span>
							</div>
							<span className='text-sm font-semibold '>{item.value}</span>
						</div>
					))}
				</div>

				{/* Empty State Message (optional) */}
				{!hasData && (
					<p className='text-sm text-gray-500 text-center mt-4'>
						No draws have been conducted yet
					</p>
				)}
			</div>
		</div>
	);
};

export default TotalEntries;
