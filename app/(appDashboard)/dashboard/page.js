'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Overview from '../../components/appDashboard/dashboard/overview';
import SubscriptionGrowth from '../../components/appDashboard/dashboard/subscriptionGrowth';
import EntryByChannel from '../../components/appDashboard/dashboard/entriesByChannel';
import RecentWinners from '../../components/appDashboard/dashboard/recentWinner';
import TotalEntries from '../../components/appDashboard/dashboard/totalEntries';
import {
	getDashboard,
	getCurrentUser,
	updateCurrentUser,
} from '../../utils/api';

const Dashboard = () => {
	const [period, setPeriod] = useState('WEEKLY');
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	// GET /api/dashboard — one call powers every widget on this page
	useEffect(() => {
		let cancelled = false;
		setLoading(true);
		getDashboard(period)
			.then((d) => {
				if (cancelled) return;
				setData(d);

				// Backend knows the admin's name — use it if we don't have one yet
				const name = d.adminInfo?.name?.trim();
				const me = getCurrentUser();
				if (name && me && !me.firstName) {
					const [firstName, ...rest] = name.split(/\s+/);
					updateCurrentUser({ firstName, lastName: rest.join(' ') });
				}
			})
			.catch((err) => {
				if (!cancelled) toast.error(err.message || 'Failed to load dashboard');
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [period]);

	return (
		<section className='space-y-6!'>
			<Overview
				overview={data?.overview}
				period={period}
				onPeriodChange={setPeriod}
				loading={loading}
			/>
			<div className='flex flex-col xl:flex-row gap-4 w-full'>
				<SubscriptionGrowth
					growth={data?.subscriptionGrowth}
					loading={loading}
				/>
				<EntryByChannel
					entries={data?.entriesByChannels}
					loading={loading}
				/>
			</div>
			<div className='flex flex-col xl:flex-row gap-4 w-full'>
				<RecentWinners
					winners={data?.recentWinners}
					loading={loading}
				/>
				<TotalEntries
					totals={data?.totalDrawsConducted}
					loading={loading}
				/>
			</div>
		</section>
	);
};

export default Dashboard;
