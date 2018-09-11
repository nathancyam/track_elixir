import * as Leaflet from 'leaflet';
import * as React from 'react';
import { Observer } from 'mobx-react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import './MapApp.css';
import { Session } from '../channels/Session';
import { context as MapStateContext } from '../MapState';

export class MapApp extends React.Component<{ session: Session }> {
  public render() {
    const position = { lat: 35.702, lng: 139.774 };

    return (
      <MapStateContext.Consumer>
        {(mapState) => (
          <Observer>
            {() => (
              <Map
                center={position}
                zoom={13}
                className="map"
                onClick={this.onClick}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                {mapState.pointsOfInterest.map((point, index) => (
                  <Marker
                    key={`${Date.now()}_${index}`}
                    position={{ lat: parseFloat(point.lat), lng: parseFloat(point.long) }}
                  >
                    <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
                  </Marker>
                ))}
              </Map>
            )}
          </Observer>
        )}
      </MapStateContext.Consumer>
    );
  }

  private onClick = (event: Leaflet.LeafletMouseEvent) => {
    const { latlng } = event;
    this.props.session.addMarker(latlng);
  }
}
