import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {
  isAllowed: boolean;
}

export const PrivateRoute = (props: PrivateRouteProps): JSX.Element => {
  if (!props.isAllowed) {
    return <Redirect to={{
      pathname: '/login',
      state: { from: props.location },
    }} />; }

  return <Route {...props} />;
}
