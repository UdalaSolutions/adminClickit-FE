'use client';

import { ConfigProvider } from 'antd';

// Make antd menus, modals and inputs use the app's font and colours
export default function AntdProvider({ children }) {
	return (
		<ConfigProvider
			theme={{
				token: {
					fontFamily: 'inherit',
					colorPrimary: '#FAAA32',
					colorText: '#1A1A1A',
					borderRadius: 8,
				},
				components: {
					Dropdown: { paddingBlock: 8 },
				},
			}}>
			{children}
		</ConfigProvider>
	);
}
