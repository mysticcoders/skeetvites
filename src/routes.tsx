import { Icon } from '@chakra-ui/react';
import { MdEmojiPeople, MdHome } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import InvitesList from "./views/admin/invites";

const routes = [
	{
		name: 'Main Dashboard',
		layout: '/admin',
		path: '/default',
		icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
		component: MainDashboard
	},
	{
		name: 'Invite Manager',
		layout: '/admin',
		path: '/invite-manager',
		icon: <Icon as={MdEmojiPeople} width='20px' height='20px' color='inherit' />,
		component: InvitesList,
		secondary: true
	},
];

export default routes;
