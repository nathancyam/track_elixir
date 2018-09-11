import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import App from './app/App';
import { context as MapState, state } from './MapState';
import registerServiceWorker from './registerServiceWorker';
import { Session } from './channels/Session';

const ENDPOINT = "ws://localhost:4000/socket";
const session = new Session(ENDPOINT, state);

export const SessionContext = React.createContext<Session>(session);

ReactDOM.render(
  <MapState.Provider value={state}>
    <SessionContext.Provider value={session}>
      <App />
    </SessionContext.Provider>
  </MapState.Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
