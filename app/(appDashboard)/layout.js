import Header from '../components/appDashboard/header';
import Sidebar from '../components/appDashboard/sidebar';

export default function Layout({ children }) {
	return (
		<div className='min-h-screen bg-background'>
			<Sidebar />
			<Header />
			<main className='ml-[300px] mt-16 p-8 pt-12'>{children}</main>
		</div>
	);
}
