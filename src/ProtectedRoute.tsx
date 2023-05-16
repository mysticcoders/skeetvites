import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
    children: any;
    isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
   children,
   isLoggedIn,
   ...rest
}) => {

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
