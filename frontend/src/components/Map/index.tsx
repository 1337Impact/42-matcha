"use client";
import { Icon, LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import React from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "./styles.css";

type MapProps = {
  latitude: number;
  longitude: number;
  showMarker?: boolean;
  markers?: {
    id: string;
    position: number[];
  }[];
};

type ChangeViewProps = {
  center: L.LatLngExpression;
};

const ChangeView: React.FC<ChangeViewProps> = ({ center }) => {
  const map = useMap();
  map.setView(center);
  return null;
};

// const positionIcon = new Icon({
//   iconUrl: "/icons/red-marker.png",
//   iconSize: [30, 30],
// });
const businessIcon = new Icon({
  iconUrl: "/icons/black-marker.svg",
  iconSize: [32, 32],
});

const Map: React.FC<MapProps> = ({
  latitude,
  longitude,
  showMarker,
  markers,
}) => {
  const navigate = useNavigate();

  const handleClick = (user_id: string) => {
    console.log("User ID: ", user_id);
    navigate("/profile/" + user_id);
    console.log(showMarker);
  };

  return (
    <MapContainer
      className="h-full w-full rounded-xl"
      center={[latitude, longitude]}
      zoom={10}
      scrollWheelZoom={true}
    >
      <ChangeView center={[latitude, longitude]} />
      <TileLayer
        attribution='&copy; <a href=""></a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      {markers &&
        markers.map((marker) => (
          <Marker
            eventHandlers={{
              click: () => {
                handleClick(marker.id);
              },
            }}
            key={marker.id}
            icon={businessIcon}
            position={marker.position as LatLngExpression}
          ></Marker>
        ))}
    </MapContainer>
  );
};

export default Map;
