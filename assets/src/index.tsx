import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AnyAction, createStore, combineReducers, Store, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createHistory from "history/createBrowserHistory";

import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware,
  RouterState
} from "react-router-redux";

import './index.css';

import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import { Session } from './channels/Session';
import { applicationReducer, AppActions, AppState } from './modules/Application';

const ENDPOINT = "ws://localhost:4000/socket";

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history);

const store: Store<{ application: AppState, router: RouterState }, AppActions | AnyAction> = createStore(combineReducers({
  application: applicationReducer,
  router: routerReducer,
}), applyMiddleware(middleware));

const session = new Session(ENDPOINT, store);

export const SessionContext = React.createContext<Session>(session);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <SessionContext.Provider value={session}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SessionContext.Provider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
