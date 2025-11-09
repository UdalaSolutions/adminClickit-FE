import Overview from '@/app/components/(appDashboard)/dashboard/overview';
import SubscriptionGrowth from '@/app/components/(appDashboard)/dashboard/subscriptionGrowth';
import EntryByChannel from '@/app/components/(appDashboard)/dashboard/entriesByChannel';
import RecentWinners from '@/app/components/(appDashboard)/dashboard/recentWinner';
import TotalEntries from '@/app/components/(appDashboard)/dashboard/totalEntries';

const Dashboard = () => {
	return (
		<section className='space-y-6!'>
			<Overview />
			<div className='flex gap-4 w-full'>
				<SubscriptionGrowth />
				<EntryByChannel />
			</div>
			<div className='flex gap-4 w-full'>
				<RecentWinners />
				<TotalEntries />
			</div>
		</section>
	);
};
export default Dashboard;
