import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import {getInviteCodes, getProfile, refresh} from "./skeet";
import store from "store2";
import {useSkeet} from "./contexts/SkeetContext";

interface ProtectedRouteProps extends RouteProps {
    children: any;
    isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
   children,
   isLoggedIn,
   ...rest
}) => {
    const { skeetDispatch, skeetState } = useSkeet();

    const [bskySession] = React.useState(() => {
        // getting stored value
        return store.get('bsky_session')
    });

    async function refreshSession() {
        try {
            const agent = await refresh(bskySession)
            const loggedInDid = agent.session.did
            const profile = await getProfile(agent, loggedInDid)
            const invites = await getInviteCodes(agent)

            skeetDispatch({type: 'LOGIN', payload: {agent: agent}})
            skeetDispatch({type: 'SET_PROFILE', payload: {profile: profile.data}})
            skeetDispatch({type: 'SET_INVITES', payload: {invites: invites}})
        } catch (error) {
            console.error(error)
        }
    }

    React.useEffect(() => {
        if (bskySession) {
            refreshSession()
        }
    }, [bskySession])

    return (
        <Route
            {...rest}
            render={(props) =>
                isLoggedIn ?
                    (
                        <>
                            { children }
                        </>
                    ) : (
                    <Redirect
                        to={{
                            pathname: '/auth',
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

export default ProtectedRoute;
