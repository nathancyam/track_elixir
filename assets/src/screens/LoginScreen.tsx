import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { SessionContext } from '..';
import { Session } from '../channels/Session';
import { Redirect } from 'react-router-dom';
import { Location } from 'history';

interface LoginScreenProps {
  location: Location<any>;
  onClick: (session: Session, userName: string, sessionId: string | null) => Promise<void>;
}

const LoginButton = (props: { onClick: (session: Session) => void }): JSX.Element => {
  return <SessionContext.Consumer>
    {(session) => (
      <Button
        variant="contained"
        color="primary"
        onClick={(event) => {
          event.preventDefault()
          props.onClick(session)
        }}>
        Submit
      </Button>
    )}
  </SessionContext.Consumer>
};

export class LoginScreen extends React.Component<LoginScreenProps, { userName: string, redirectOnReferrer: boolean, sessionId: string | null }> {

  public state = { userName: '', redirectOnReferrer: false, sessionId: null };

  public componentDidMount() {
    if (this.props.location.state && this.props.location.state.from.pathname.includes('/map/')) {
      this.setState({ sessionId: this.props.location.state.from.pathname.replace('/map/', '') })
    }
  }

  public render() {
    if (this.state.redirectOnReferrer) {
      return <Redirect to={this.props.location.pathname} />;
    }

    if (this.state.redirectOnReferrer && this.state.sessionId) {
      return <Redirect to={`/map/${this.state.sessionId}`} />;
    }

    return <section>
      <TextField
        id="with-placeholder"
        label="Your Name"
        placeholder="What do people call you?"
        margin="normal"
        value={this.state.userName}
        onChange={this.onChange}
      />
      <LoginButton onClick={this.onLoginClick} />
    </section>
  }

  private onLoginClick = async (session: Session) => {
    try {
      await this.props.onClick(session, this.state.userName, this.state.sessionId);
      this.setState({ redirectOnReferrer: true });
    } catch (err) {
      console.warn(err);
    }
  }

  private onChange = (event: React.ChangeEvent<any>) => {
    event.preventDefault();
    this.setState({ userName: event.currentTarget.value });
  }
}
