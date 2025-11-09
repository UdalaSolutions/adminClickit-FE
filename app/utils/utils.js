import {
	Home,
	Users,
	Trophy,
	Ticket,
	MessageSquare,
	FileCheck,
	Settings,
} from 'lucide-react';

export const menuItems = [
	{ icon: Home, label: 'Dashboard', path: '/dashboard' },
	{ icon: Users, label: 'Users', path: '/users' },
	{ icon: Trophy, label: 'Winners', path: '/winners' },
	{ icon: Ticket, label: 'Draw management', path: '/draw-management' },
	{ icon: MessageSquare, label: 'Messaging center', path: '/messaging' },
	{ icon: FileCheck, label: 'Audit & Compliance', path: '/audit' },
	{ icon: Settings, label: 'Settings', path: '/settings' },
];

export const notifications = [
	{
		type: 'success',
		title: 'Weekly draw - 01/10/25 has been concluded',
		time: 'Today 11:30 AM',
		unread: true,
	},
	{
		type: 'success',
		title: 'Weekly draw - 01/10/25 has been concluded',
		time: 'Today 11:30 AM',
		unread: true,
	},
	{
		type: 'success',
		title: 'Weekly draw - 01/10/25 has been concluded',
		time: 'Today 11:30 AM',
		unread: true,
	},
	{
		type: 'success',
		title: 'Weekly draw - 01/10/25 has been concluded',
		time: 'Today 11:30 AM',
		unread: true,
	},
	{
		type: 'info',
		title: 'Weekly draw - 01/10/25 has been concluded',
		time: 'Today 11:30 AM',
		unread: false,
	},
	{
		type: 'warning',
		title: 'Weekly draw - 01/10/25 has been Scheduled',
		time: '01/10/25 11:30 AM',
		unread: false,
	},
	{
		type: 'info',
		title: 'Weekly draw - 01/10/25 has been concluded',
		time: 'Today 11:30 AM',
		unread: false,
	},
	{
		type: 'warning',
		title: 'Weekly draw - 01/10/25 has been Scheduled',
		time: '01/10/25 11:30 AM',
		unread: false,
	},
];
