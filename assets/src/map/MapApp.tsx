import * as Leaflet from 'leaflet';
import * as React from 'react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import './MapApp.css';

export class MapApp extends React.Component {
  public render() {
    const position = { lat: 35.702, lng: 139.774 };

    return (
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
        <Marker position={position}>
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>
      </Map>
    );
  }

  private onClick = (event: Leaflet.LeafletMouseEvent) => {
    debugger;
  }
}
