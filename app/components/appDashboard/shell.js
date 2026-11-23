'use client';

import { createContext, useContext, useState } from 'react';

// Shares the mobile sidebar open/closed state between Header and Sidebar
const SidebarContext = createContext({ open: false, setOpen: () => {} });

export const useSidebar = () => useContext(SidebarContext);

export default function DashboardShell({ children }) {
	const [open, setOpen] = useState(false);
	return (
		<SidebarContext.Provider value={{ open, setOpen }}>
			{children}
		</SidebarContext.Provider>
	);
}
