import { Icon } from '@chakra-ui/react';
import { MdEmojiPeople, MdHome, MdLock } from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import InvitesList from "./views/admin/invites";

// Auth Imports
import SignInCentered from 'views/auth/signIn';

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
	{
		name: 'Sign In',
		layout: '/auth',
		path: '/sign-in',
		icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
		component: SignInCentered
	},
];

export default routes;
