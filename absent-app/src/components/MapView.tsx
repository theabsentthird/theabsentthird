import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Type definitions
interface MapMarker {
  position: LatLngExpression;
  popupText: string;
  icon?: L.Icon;
}

// Default configuration
const DEFAULT_CONFIG = {
  center: [53.2707, -9.0568] as LatLngExpression, // Galway coordinates
  zoom: 13,
  scrollWheelZoom: true,
  tileLayer: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  markers: [
    {
      position: [53.2707, -9.0568] as LatLngExpression,
      popupText: 'You are here in Galway 🧡'
    }
  ]
};

interface MapViewProps {
  center?: LatLngExpression;
  zoom?: number;
  markers?: MapMarker[];
  className?: string;
  tileLayerUrl?: string;
  tileLayerAttribution?: string;
}

const MapView: React.FC<MapViewProps> = ({
  center = DEFAULT_CONFIG.center,
  zoom = DEFAULT_CONFIG.zoom,
  markers = DEFAULT_CONFIG.markers,
  className = 'w-full h-screen',
  tileLayerUrl = DEFAULT_CONFIG.tileLayer.url,
  tileLayerAttribution = DEFAULT_CONFIG.tileLayer.attribution
}) => {
  return (
    <div className={className}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={DEFAULT_CONFIG.scrollWheelZoom} 
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution={tileLayerAttribution}
          url={tileLayerUrl}
        />

        {markers.map((marker, index) => (
          <Marker key={`marker-${index}`} position={marker.position}>
            <Popup>
              {marker.popupText}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;