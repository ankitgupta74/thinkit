"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MapPinIcon } from "lucide-react";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";
import { Order } from "@/types";
import { iconsForLeafpad } from "@/public/assets";
import { LiveLocation } from "@/types/liveLocation";

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 1,
    });
  }, [center, map]);
  return null;
}

export default function LiveMap({
  order,
  liveLocation,
}: {
  order: Order;
  liveLocation: LiveLocation | null;
}) {
  const mapRef = useRef<L.Map | null>(null);

  const truckIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: iconsForLeafpad.truck,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      }),
    [],
  );

  const destinationIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: iconsForLeafpad.destination,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
    [],
  );

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  if (order.status === "Delivered" || order.status === "Cancelled") {
    return null;
  }

  const center: [number, number] =
    liveLocation?.lat != null && liveLocation?.lng != null
      ? [liveLocation.lat, liveLocation.lng]
      : [order.shippingAddress.lat, order.shippingAddress.lng];

  if (center[0] == null || center[1] == null) {
    return (
      <div className="h-70 bg-app-green/5 flex-center rounded-2xl">
        <MapPinIcon />
      </div>
    );
  }

  return (
    <div className="relative z-0 h-60 sm:h-70 rounded-2xl overflow-hidden border border-app-border">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={15}
        zoomControl={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {liveLocation && (
          <Marker
            position={[liveLocation.lat, liveLocation.lng]}
            icon={truckIcon}
          >
            <Popup>Delivery Partner</Popup>
          </Marker>
        )}

        <Marker
          position={[order.shippingAddress.lat, order.shippingAddress.lng]}
          icon={destinationIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>

        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
}
