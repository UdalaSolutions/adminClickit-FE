import Header from '../components/appDashboard/header';
import Sidebar from '../components/appDashboard/sidebar';
import DashboardShell from '../components/appDashboard/shell';

export default function Layout({ children }) {
	return (
		<DashboardShell>
			<div className='min-h-screen bg-background'>
				<Sidebar />
				<Header />
				<main className='lg:ml-[260px] xl:ml-[300px] pt-24 px-4 pb-8 sm:px-6 lg:px-8 lg:pt-28 min-w-0'>
					{children}
				</main>
			</div>
		</DashboardShell>
	);
}
