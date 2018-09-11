import { observable } from 'mobx';
import { observer, Observer } from 'mobx-react';
import * as React from 'react';

import './App.css';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { context as MapStateContext, MapState } from '../MapState';
import { Session } from '../channels/Session';
import { MapApp } from '../map/MapApp';
import { SessionContext } from '..';

@observer
class App extends React.Component {

  @observable private userName: string;

  public render() {
    return (
      <MapStateContext.Consumer>
        {(mapState) => (
          <Observer>
            {() => (
              <div className="App">
                <AppBar position="static" color="default">
                  <Toolbar>
                    <Typography variant="title" color="inherit">
                      Trip Tracker
                    </Typography>
                  </Toolbar>
                </AppBar>
                {mapState.loggedIn && <SessionContext.Consumer>
                  {session => <MapApp session={session} />}
                </SessionContext.Consumer>}
                {!mapState.loggedIn && <section>
                  <TextField
                    id="with-placeholder"
                    label="Your Name"
                    placeholder="What do people call you?"
                    margin="normal"
                    value={this.userName}
                    onChange={this.onChange}
                  />
                  <SessionContext.Consumer>
                    {(session) => (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onClick(mapState, session)}>Submit
                      </Button>
                    )}
                  </SessionContext.Consumer>
                </section>}
              </div>
            )}
          </Observer>
        )}
      </MapStateContext.Consumer>
    );
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.userName = event.currentTarget.value;
  }

  private onClick = (state: MapState, session: Session) => async (event: React.MouseEvent<any>) => {
    event.preventDefault();
    const response = await session.createNewUser({ id: "", name: this.userName });
    state.createSession(response);
  }
}

export default App;
