import * as React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import './App.css';

import { Session, NewUserResponse } from '../channels/Session';
import { LoginScreen } from '../screens/LoginScreen';
import { MapApp } from '../screens/MapApp';
import { MenuAppBar } from '../components/MenuAppBar';
import { PrivateRoute } from '../components/PrivateRoute';
import { AppState, applicationActions } from '../modules/Application';
import { push } from 'react-router-redux';

interface RouteContainerProps {
  isLoggedIn: boolean;
  onCreateSession: (payload: NewUserResponse) => void;
  onClick: (session: Session, name: string, sessionId?: string) => Promise<void>;
}

class RouteContainer extends React.Component<RouteContainerProps & { activeSession: string | null }> {
  public render() {
    return (
      <Switch>
        <Route
          exact={true}
          path="/login"
          render={({ location }) =>
            this.props.isLoggedIn
              ? this.mapRedirect
              : <LoginScreen onClick={this.onClick} location={location} />
          }
        />
        <PrivateRoute
          exact={true}
          path="/map/:sessionId"
          isAllowed={this.props.isLoggedIn}
          render={({ location }) => <MapApp pointsOfInterests={[]} location={location} />}
        />
        <Route
          exact={true}
          path="/"
          render={() => {
            return this.props.isLoggedIn
              ? this.mapRedirect
              : <Redirect to="/login" />
          }}
        />
      </Switch>
    );
  }

  private get mapRedirect(): JSX.Element {
    return <Redirect to={`/map/${this.props.activeSession}`} />;
  }

  private onClick = async (session: Session, name: string, sessionId: string | null) => {
    if (sessionId != null) {
      this.props.onClick(session, name, sessionId);
    } else {
      this.props.onClick(session, name);
    }
  }
}

class App extends React.Component<{ isLoggedIn: boolean, activeSession: string | null, onCreateSession: (payload: NewUserResponse) => void, onLogin: () => void }> {

  public render() {
    return (
      <div className="App">
        <MenuAppBar isLoggedIn={this.props.isLoggedIn} />
        <div>
          <RouteContainer
            {...this.props}
            onClick={this.onClick}
          />
        </div>
      </div>
    );
  }

  private onClick = async (session: Session, name: string, sessionId?: string): Promise<void> => {
    const response = await session.createNewUserAndSession({ id: "", name }, sessionId);
    this.props.onCreateSession(response);
  }
}

export const ConnectedApp = connect<{ isLoggedIn: boolean, activeSession: string | null }, { onCreateSession: (payload: NewUserResponse) => void, onLogin: () => void }, RouteComponentProps<any>, { application: AppState }>((state) => ({
  activeSession: state.application.activeSession ? state.application.activeSession.id : null,
  isLoggedIn: state.application.currentUser != null
}), (dispatch) => ({
  onCreateSession(payload: NewUserResponse) {
    dispatch(applicationActions.createSession(payload));
  },
  onLogin() {
    dispatch(push('/map'))
  }
}))(App);

export default withRouter(ConnectedApp);
