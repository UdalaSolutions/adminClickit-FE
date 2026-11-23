'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DRAW_COLORS = { Daily: '#FFC857', Weekly: '#FAAA32', Monthly: '#0B132A' };

// Backend: { total, dailyDraw, weeklyDraw, monthlyDraw, breakdown: [...] }
const TotalEntries = ({ totals, loading }) => {
	const drawData = [
		{ name: 'Daily draw', value: totals?.dailyDraw || 0, color: DRAW_COLORS.Daily },
		{ name: 'Weekly draw', value: totals?.weeklyDraw || 0, color: DRAW_COLORS.Weekly },
		{ name: 'Monthly draw', value: totals?.monthlyDraw || 0, color: DRAW_COLORS.Monthly },
	];
	const totalDraws =
		totals?.total ?? drawData.reduce((acc, item) => acc + item.value, 0);
	const hasData = totalDraws > 0;
	// A grey ring when there is nothing to chart
	const chartData = hasData
		? drawData.filter((d) => d.value > 0)
		: [{ name: 'None', value: 1, color: '#F0F0F0' }];

	return (
		<div className='bg-white p-4 rounded-xl w-full xl:w-[350px] xl:shrink-0'>
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
							{loading ? '–' : totalDraws}
						</span>
					</div>
				</div>

				{/* Legend */}
				<div className='mt-2 space-y-3 w-full'>
					{drawData.map((item, index) => (
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
