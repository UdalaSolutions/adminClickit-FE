import Overview from '../../components/appDashboard/dashboard/overview';
import SubscriptionGrowth from '../../components/appDashboard/dashboard/subscriptionGrowth';
import EntryByChannel from '../../components/appDashboard/dashboard/entriesByChannel';
import RecentWinners from '../../components/appDashboard/dashboard/recentWinner';
import TotalEntries from '../../components/appDashboard/dashboard/totalEntries';

const Dashboard = () => {
	return (
		<section className='space-y-6!'>
			<Overview />
			<div className='flex flex-col xl:flex-row gap-4 w-full'>
				<SubscriptionGrowth />
				<EntryByChannel />
			</div>
			<div className='flex flex-col xl:flex-row gap-4 w-full'>
				<RecentWinners />
				<TotalEntries />
			</div>
		</section>
	);
};
export default Dashboard;
