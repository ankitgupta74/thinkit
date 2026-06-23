"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { MapPinIcon } from "lucide-react";
import L from "leaflet";
import { useEffect, useMemo, useRef } from "react";

import { LiveLocation, Order } from "@/types";
import { iconsForLeafpad } from "@/public/assets";

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    // React state changes do not automatically move Leaflet map camera.
    // So whenever center changes, manually shift the map view.
    // Think of this like: "driver moved → move camera too".
    map.flyTo(center, map.getZoom(), {
      animate: true,
      duration: 1,
    });
  }, [center, map]);

  // This component exists only for side effects.
  // No UI needed, only map behavior update.
  return null;
}

export default function LiveMap({
  order,
  liveLocation,
}: {
  order: Order;
  liveLocation: LiveLocation | null;
  }) {
  // Store the actual Leaflet map instance.
  // useRef keeps value between renders without causing re-renders.
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
  // Create icon only once.
  // Without useMemo, every render creates a new icon object unnecessarily.

  const destinationIcon = useMemo(
    () =>
      new L.Icon({
        iconUrl: iconsForLeafpad.destination,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      }),
    [],
  );
  // Same idea here: create once and reuse instead of rebuilding repeatedly.

  useEffect(() => {
    // Safety cleanup:
    // remove map instance when component leaves screen.
    // Prevents duplicate maps or memory issues.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // No need to show tracking after delivery flow is finished.
  if (order.status === "Delivered" || order.status === "Cancelled") {
    return null;
  }

  const center: [number, number] = liveLocation?.lat
    ? [liveLocation.lat, liveLocation.lng]
    : [order.shippingAddress.lat, order.shippingAddress.lng];
  // Priority:
  // Live truck location → use it, Otherwise fallback to delivery address
  // Rule to remember: Always keep a backup location for maps.

  if (!center[0] || !center[1]) {
    return (
      <div className="h-70 bg-app-green/5 flex-center rounded-2xl">
        {/* Show simple placeholder if map coordinates are unavailable */}
        <MapPinIcon />
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden border border-app-border"
      style={{ height: 280 }}
    >
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
            {/* Current live location of delivery person */}
            <Popup>Delivery Partner</Popup>
          </Marker>
        )}

        <Marker
          position={[order.shippingAddress.lat, order.shippingAddress.lng]}
          icon={destinationIcon}
        >
          {/* Final place where order should arrive */}
          <Popup>Delivery Address</Popup>
        </Marker>

        {/* Keeps map camera synced with changing live coordinates */}
        <MapUpdater center={center} />
      </MapContainer>
    </div>
  );
}
