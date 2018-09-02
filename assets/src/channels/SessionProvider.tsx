import * as React from 'react';

import { Session } from './Session';

const ENDPOINT = "ws://localhost:4000/socket";

const session = new Session(ENDPOINT);

export const SessionContext = React.createContext<Session>(session);

export class SessionProvider extends React.Component {

  public render() {
    return <SessionContext.Provider value={session}>
      {this.props.children}
    </SessionContext.Provider>;
  }

}
