import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const state = jest.fn() as any;

  const div = document.createElement('div');
  ReactDOM.render(<App mapState={state} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
