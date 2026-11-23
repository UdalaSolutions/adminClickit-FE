import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import AntdProvider from './components/AntdProvider';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata = {
	title: 'clickit | admin dashboard',
	description: 'clickit admin dashboard',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={`${inter.className} antialiased`}>
				<AntdProvider>{children}</AntdProvider>
				<ToastContainer
					position='top-right'
					autoClose={3000}
				/>
			</body>
		</html>
	);
}
