import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Default Leaflet marker icons reference files that don't survive bundling;
// point them at a CDN so pins render correctly.
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13, { duration: 0.8 });
  }, [position]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function ResultsMap({ items = [], focus, defaultCenter = [37.7749, -122.4194], className = "" }) {
  const withCoords = items.filter((i) => i.coordinates);
  const center = focus || withCoords[0]?.coordinates || defaultCenter;

  return (
    <div className={`h-64 w-full overflow-hidden rounded-2xl border border-slate-200 ${className}`}>
      <MapContainer center={center} zoom={11} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {withCoords.map((item, i) => (
          <Marker key={i} position={item.coordinates} icon={markerIcon}>
            <Popup>
              <strong>{item.name}</strong>
              {item.fields?.[0]?.value && <div>{item.fields[0].value}</div>}
            </Popup>
          </Marker>
        ))}
        <FlyTo position={focus} />
      </MapContainer>
    </div>
  );
}
