import {
	Home,
	UserRoundPlus,
	Trophy,
	MessageCircleMore,
	Settings,
	FileSearch,
	Gamepad,
} from 'lucide-react';

export const menuItems = [
	{ icon: Home, label: 'Dashboard', path: '/dashboard' },
	{ icon: UserRoundPlus, label: 'Users', path: '/users' },
	{ icon: Trophy, label: 'Winners', path: '/winners' },
	{ icon: Gamepad, label: 'Draw management', path: '/draw-management' },
	{ icon: MessageCircleMore, label: 'Messaging center', path: '/messaging' },
	{ icon: FileSearch, label: 'Audit & Compliance', path: '/audit' },
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

export const users = [
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Daily',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Weekly',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Weekly',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Daily',
		status: 'Unsubscribed',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Weekly',
		status: 'Unsubscribed',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Daily',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Weekly',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Monthly',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Daily',
		status: 'Active',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Weekly',
		status: 'Unsubscribed',
	},
	{
		date: '01/10/25',
		phone: '+234 806 1325 269',
		plan: 'Monthly',
		status: 'Active',
	},
];

export const winners = [
	{
		date: '01/10/25',
		drawType: 'Daily',
		winner: '+234 806 1325 269',
		prize: '₦10,000',
		status: 'Paid',
	},
	{
		date: '01/10/25',
		drawType: 'Weekly',
		winner: '+234 806 1325 269',
		prize: '₦50,000',
		status: 'Paid',
	},
	{
		date: '01/10/25',
		drawType: 'Weekly',
		winner: '+234 806 1325 269',
		prize: '₦50,000',
		status: 'Paid',
	},
	{
		date: '01/10/25',
		drawType: 'Daily',
		winner: '+234 806 1325 269',
		prize: '₦10,000',
		status: 'Paid',
	},
	{
		date: '01/10/25',
		drawType: 'Weekly',
		winner: '+234 806 1325 269',
		prize: '₦50,000',
		status: 'Pending',
	},
	{
		date: '01/10/25',
		drawType: 'Daily',
		winner: '+234 806 1325 269',
		prize: '₦10,000',
		status: 'Pending',
	},
	{
		date: '01/10/25',
		drawType: 'Weekly',
		winner: '+234 806 1325 269',
		prize: '₦50,000',
		status: 'Paid',
	},
	{
		date: '01/10/25',
		drawType: 'Monthly',
		winner: '+234 806 1325 269',
		prize: '₦200,000',
		status: 'Pending',
	},
	{
		date: '01/10/25',
		drawType: 'Daily',
		winner: '+234 806 1325 269',
		prize: '₦10,000',
		status: 'Pending',
	},
	{
		date: '01/10/25',
		drawType: 'Weekly',
		winner: '+234 806 1325 269',
		prize: '₦50,000',
		status: 'Pending',
	},
	{
		date: '01/10/25',
		drawType: 'Monthly',
		winner: '+234 806 1325 269',
		prize: '₦200,000',
		status: 'Paid',
	},
];

export const draws = [
	{
		id: 'DRW-1001',
		drawType: 'Daily',
		scheduleTime: '2025-11-09 10:00 AM',
		executedTime: '2025-11-09 10:05 AM',
		status: 'Completed',
	},
	{
		id: 'DRW-1002',
		drawType: 'Weekly',
		scheduleTime: '2025-11-09 12:00 PM',
		executedTime: '2025-11-09 12:10 PM',
		status: 'Completed',
	},
	{
		id: 'DRW-1003',
		drawType: 'Monthly',
		scheduleTime: '2025-11-09 03:00 PM',
		executedTime: '2025-11-09 03:00 PM',
		status: 'Scheduled',
	},
	{
		id: 'DRW-1004',
		drawType: 'Daily',
		scheduleTime: '2025-11-10 09:00 AM',
		executedTime: '2025-11-09 03:00 PM',
		status: 'Queued',
	},
	{
		id: 'DRW-1005',
		drawType: 'Weekly',
		scheduleTime: '2025-11-10 01:00 PM',
		executedTime: '2025-11-09 03:00 PM',
		status: 'Scheduled',
	},
	{
		id: 'DRW-1006',
		drawType: 'Monthly',
		scheduleTime: '2025-11-10 05:00 PM',
		executedTime: '2025-11-09 03:00 PM',
		status: 'Pending',
	},
	{
		id: 'DRW-1007',
		drawType: 'Daily',
		scheduleTime: '2025-11-11 09:00 AM',
		executedTime: '2025-11-09 03:00 PM',
		status: 'Queued',
	},
	{
		id: 'DRW-1008',
		drawType: 'Weekly',
		scheduleTime: '2025-11-11 01:00 PM',
		executedTime: '2025-11-11 01:07 PM',
		status: 'Completed',
	},
];
