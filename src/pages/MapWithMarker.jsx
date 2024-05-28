import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};
const center = {
    lat: 56.858692, 
    lng: 35.917580,
};

function MapWithMarker({ onMapClick }) {
    const [marker, setMarker] = useState(null);

    const handleMapClick = (event) => {
        const newMarker = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setMarker(newMarker);
        if (onMapClick) {
            onMapClick(newMarker); // Передаем координаты в родительский компонент
        }
    };

    return (
        <LoadScript googleMapsApiKey="AIzaSyCsaV4TfjSgPf9d9nVrTYtHFhpEW1fnwx0">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onClick={handleMapClick}
            >
                {marker && <Marker position={{ lat: marker.lat, lng: marker.lng }} />}
            </GoogleMap>
        </LoadScript>
    );
}

export default MapWithMarker;
