import * as Leaflet from 'leaflet';
import * as React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'
import { connect } from 'react-redux';
import './MapApp.css';
import { Session } from '../channels/Session';
import { Location } from 'history';
import { SessionContext } from '..';
import { AppState } from '../modules/Application';

class MapScreen extends React.Component<{ session: Session, pointsOfInterests: any[], onClick: (event: Leaflet.LeafletMouseEvent) => void }> {

  public componentDidMount() {
    this.props.session.sync();
  }

  public render() {
    const props = this.props;
    const position = { lat: 35.702, lng: 139.774 };

    return <Map
      center={position}
      zoom={13}
      className="map"
      onClick={props.onClick}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      {props.pointsOfInterests.map((point, index) => (
        <Marker
          key={`${Date.now()}_${index}`}
          position={{ lat: parseFloat(point.lat), lng: parseFloat(point.long) }}
        >
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>
      ))}
    </Map>;
  }
}

const ConnectedMapScreen = connect<{ pointsOfInterests: any[] }, {}, {}, { application: AppState }>(state => ({
  pointsOfInterests: state.application.pointsOfInterests
}))(MapScreen);

export class MapApp extends React.Component<{ location: Location<any>, pointsOfInterests: any[] }> {
  public render() {

    return (
      <SessionContext.Consumer>
        {(session) => (
          <ConnectedMapScreen
            session={session}
            onClick={(event) => {
              this.onClick(session)(event);
            }}
          />
        )}
      </SessionContext.Consumer>
    )
  }

  private onClick = (session: Session) => (event: Leaflet.LeafletMouseEvent) => {
    const { latlng } = event;
    session.addMarker(latlng);
  }
}
