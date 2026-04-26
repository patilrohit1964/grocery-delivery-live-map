"use client";
import React, { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
const marker = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
}); //we can set icon as we want
type props = {
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
};
const CheckoutMap = ({ position, setPosition }: props) => {
  // for marker animate if we drag marker then animate map with that marker
  const DraggableMarker: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position as LatLngExpression);
    }, [position]);
    return (
      <Marker
        position={position as LatLngExpression}
        icon={marker}
        draggable={true}
        eventHandlers={{
          dragend: (e: L.LeafletEvent) => {
            const dragMarker = e.target as L.Marker;
            const { lat, lng } = dragMarker.getLatLng();
            setPosition([lat, lng]);
          },
        }}
      >
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  // using this we import and use leaflet map in our project and set position of marker according to user location
  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker />
    </MapContainer>
  );
};

export default CheckoutMap;
