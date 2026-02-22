import React from "react";
import { ILocation } from "./DeliveryBoyDashboard";
import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
interface IProp {
  userLocation: ILocation;
  deliveryLocation: ILocation;
}
const LiveMap = ({ userLocation, deliveryLocation }: IProp) => {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/2145/2145388.png",
    iconSize: [30, 30],
  });
  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/10473/10473299.png",
    iconSize: [30, 30],
  });
  const center = [userLocation.latitude, userLocation.longitude];
  const linePosition =
    deliveryLocation && userLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryLocation.latitude, deliveryLocation.longitude],
        ]
      : [];
  return (
    <div className="w-full h-125 rounded-xl overflow-hidden shadow relative">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* using this we can assign icon and their positions */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
            {/* using this we can show popup when click on that icons */}
          <Popup>delivery address</Popup>
        </Marker>
        {deliveryLocation && (
          <Marker
            position={[deliveryLocation.latitude, deliveryLocation.longitude]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}
        {/* using this we can add line between in delivery boy and user */}
        <Polyline positions={linePosition as any} color="green" />
        {/* <DraggableMarker /> */}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
