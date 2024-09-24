"use client";
import React, { useEffect, useState } from "react";
import { Icon, LatLngExpression } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";
import "./styles.css";
import { useNavigate } from "react-router-dom";

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

const positionIcon = new Icon({
  iconUrl: "/icons/red-marker.png",
  iconSize: [30, 30],
});
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
