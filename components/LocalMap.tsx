// "use client";

// import { useEffect, useRef } from "react";

// import {
//   Map as MapLibreMap,
//   NavigationControl,
//   AttributionControl,
//   Marker,
//   Popup,
// } from "maplibre-gl";

// type LocalMapProps = {
//   latitude?: number;
//   longitude?: number;
// };

// export default function LocalMap({
//   latitude = 17.385,
//   longitude = 78.4867,
// }: LocalMapProps) {
//   const mapContainerRef =
//     useRef<HTMLDivElement | null>(null);

//   const mapRef =
//     useRef<MapLibreMap | null>(null);

//   useEffect(() => {
//     if (!mapContainerRef.current) {
//       return;
//     }

//     if (mapRef.current) {
//       return;
//     }

//     const map = new MapLibreMap({
//       container: mapContainerRef.current,

//       style:
//         "https://tiles.openfreemap.org/styles/liberty",

//       center: [
//         longitude,
//         latitude,
//       ],

//       zoom: 12,

//       attributionControl: false,
//     });

//     mapRef.current = map;

//     map.addControl(
//       new NavigationControl(),
//       "top-right"
//     );

//     map.addControl(
//       new AttributionControl({
//         compact: true,
//       }),
//       "bottom-right"
//     );

//     map.on("load", () => {
//       const popup = new Popup({
//         offset: 25,
//       }).setHTML(`
//         <div style="
//           min-width: 180px;
//           padding: 4px;
//           font-family: Arial, sans-serif;
//         ">
//           <strong
//             style="
//               font-size: 16px;
//               color: #111827;
//             "
//           >
//             LocalMatch
//           </strong>

//           <div
//             style="
//               margin-top: 6px;
//               color: #667085;
//               font-size: 13px;
//             "
//           >
//             Your selected location
//           </div>
//         </div>
//       `);

//       new Marker({
//         color: "#1769ff",
//       })
//         .setLngLat([
//           longitude,
//           latitude,
//         ])
//         .setPopup(popup)
//         .addTo(map);
//     });

//     return () => {
//       map.remove();
//       mapRef.current = null;
//     };
//   }, [latitude, longitude]);

//   return (
//     <div
//       ref={mapContainerRef}
//       className="local-map"
//     />
//   );
// }




"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Business } from "@/lib/types";

type Props = {
  businesses: Business[];
  latitude: number;
  longitude: number;
};

const icon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LocalMap({
  businesses,
  latitude,
  longitude,
}: Props) {
  return (
    <div className="map-container">
      <MapContainer
        center={[
          latitude,
          longitude,
        ]}
        zoom={14}
        scrollWheelZoom={true}
        style={{
          height: "500px",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[
            latitude,
            longitude,
          ]}
          icon={icon}
        >
          <Popup>
            <strong>
              Your location
            </strong>
          </Popup>
        </Marker>

        {businesses.map(
          (business) => (
            <Marker
              key={business.id}
              position={[
                business.latitude,
                business.longitude,
              ]}
              icon={icon}
            >
              <Popup>
                <strong>
                  {business.name}
                </strong>

                <br />

                Match Score:{" "}
                {business.matchScore}
                /100

                <br />

                ⭐{" "}
                {business.rating ||
                  "No rating"}
              </Popup>
            </Marker>
          )
        )}
      </MapContainer>
    </div>
  );
}