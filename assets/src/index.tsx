import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';

import App from './app/App';
import { SessionProvider } from './channels/SessionProvider';
import { context as MapState, state } from './MapState';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <MapState.Provider value={state}>
    <SessionProvider>
      <App mapState={state} />
    </SessionProvider>
  </MapState.Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
