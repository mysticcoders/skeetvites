import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import {Router, Route, Switch, Redirect, HashRouter} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
import {SkeetProvider, useSkeet} from './contexts/SkeetContext';
import ProtectedRoute from "./ProtectedRoute";

const history = createBrowserHistory();

const App: React.FC = () => {
	const { skeetState } = useSkeet();

	return (
		<HashRouter>
			<Switch>
				<Route path="/auth">
					<AuthLayout />
				</Route>
				<ProtectedRoute
					path="/admin"
					isLoggedIn={skeetState.isLoggedIn}
				>
					<AdminLayout />
				</ProtectedRoute>
				<Redirect from='/' to='/admin' />
			</Switch>
		</HashRouter>
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
