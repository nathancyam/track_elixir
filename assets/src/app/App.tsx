import { observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import './App.css';

import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { context as MapStateContext, MapState } from '../MapState';
import { SessionContext } from '../channels/SessionProvider';
import { Session } from '../channels/Session';
import { MapApp } from '../map/MapApp';

@observer
class App extends React.Component<{ mapState: MapState }> {

  @observable private userName: string;

  public render() {
    return (
      <MapStateContext.Consumer>
        {(mapState) => (
          <div className="App">
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="title" color="inherit">
                  Trip Tracker
                </Typography>
              </Toolbar>
            </AppBar>
            {mapState.currentUser != null && <MapApp />}
            {mapState.currentUser == null && <section>
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
                  <MapStateContext.Consumer>
                    {state => (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onClick(state, session)}>Submit
                      </Button>
                    )}
                  </MapStateContext.Consumer>
                )}
              </SessionContext.Consumer>
            </section>}
          </div>
        )}
      </MapStateContext.Consumer>
    );
  }

  private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.userName = event.currentTarget.value;
  }

  private onClick = (state: MapState, session: Session) => (event: React.MouseEvent<any>) => {
    event.preventDefault();
    session.createNewUser({ id: "", name: this.userName });
  }
}

export default App;
