import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import {Route, Switch, Redirect, Router} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import {SkeetProvider, useSkeet} from './contexts/SkeetContext';
import ProtectedRoute from "./ProtectedRoute";
import InviteManager from "./layouts/admin/InviteManager";
import store from "store2";
import {getInviteCodes, getProfile, refresh} from "./skeet";

const browserHistory = createBrowserHistory();

const App: React.FC = () => {
	const { skeetState, skeetDispatch } = useSkeet();

	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	const [bskySession] = React.useState(() => {
		return store.get('bsky_session')
	});

	React.useEffect(() => {
		if (bskySession) {

			async function refreshSession() {
				try {
					console.log('Calling refreshSession')
					const agent = await refresh(bskySession)
					// const invites = await getInviteCodes(agent)

					skeetDispatch({type: 'LOGIN', payload: {agent: agent}})
					// skeetDispatch({type: 'SET_INVITES', payload: {invites: invites}})

					setIsLoggedIn(true)
				} catch (error) {
					console.error(error)
				}
			}
			refreshSession()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bskySession])

	React.useEffect(() => {
		if (bskySession && skeetState.isLoggedIn) {
			async function fetchProfile() {
				try {
					const profile = await getProfile(skeetState.agent, skeetState.agent.session.did)
					skeetDispatch({type: 'SET_PROFILE', payload: {profile: profile.data}})
				} catch (error) {
					console.error(error)
				}
			}

			async function fetchInvites() {
				try {
					const invites = await getInviteCodes(skeetState.agent)
					skeetDispatch({type: 'SET_INVITES', payload: {invites: invites}})
				} catch (error) {
					console.error(error)
				}
			}
			fetchProfile()
			fetchInvites()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bskySession, skeetState.isLoggedIn])

	return (
		<Router history={browserHistory}>
			<Switch>
				<Route path="/auth">
					<AuthLayout />
				</Route>
				<ProtectedRoute
					path="/admin/default"
					isLoggedIn={isLoggedIn}
				>
					<AdminLayout />
				</ProtectedRoute>
				<ProtectedRoute
					path="/admin/invite-manager"
					isLoggedIn={isLoggedIn}
				>
					<InviteManager />
				</ProtectedRoute>
				<Redirect from='/' to='/admin/default' />
			</Switch>
		</Router>
	);
};
ReactDOM.render(
	<ChakraProvider theme={theme}>
		<React.StrictMode>
			<SkeetProvider>
				<App />
			</SkeetProvider>
		</React.StrictMode>
	</ChakraProvider>,
	document.getElementById('root')
);
