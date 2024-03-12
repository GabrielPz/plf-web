import React, { useState, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Importa as imagens do marcador
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xPng from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Cria um novo ícone padrão com as imagens importadas
const defaultIcon = L.icon({
  iconUrl: markerIconPng.src,
  iconRetinaUrl: markerIcon2xPng.src,
  shadowUrl: markerShadowPng.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Define o ícone padrão para todos os marcadores
L.Marker.prototype.options.icon = defaultIcon;

interface MapProps {
    onSelectLocal: (latitude: number, longitude: number) => void;
    latLng: LatLngTuple;
}

export default function Map({onSelectLocal, latLng}: MapProps) {
    const [brutePosition, setBrutePosition] = useState<LatLngTuple>(latLng);

    useEffect(() => {
        setBrutePosition(latLng); // Atualiza a posição do marcador com o valor de latLng quando latLng é atualizado.
    }, [latLng]);

    function LocationMarker() {
        const map = useMap();

        useMapEvents({
            click(e) {
                const newLatLng: LatLngTuple = [e.latlng.lat, e.latlng.lng];
                setBrutePosition(newLatLng); // Atualiza a posição do marcador para a posição do clique no mapa.
                onSelectLocal(e.latlng.lat, e.latlng.lng); // Atualiza a posição selecionada pelo usuário.
            },
        });

        useEffect(() => {
            map.flyTo(brutePosition); // Move o mapa para a nova posição do marcador.
            onSelectLocal(brutePosition[0], brutePosition[1]); 
        }, [brutePosition, map]);

        return (
            <Marker position={brutePosition}>
                <Popup>Seu Local fica aqui: <br/> {brutePosition[0]}, {brutePosition[1]}</Popup>
            </Marker>
        );
    }

    return (
        <MapContainer style={{ height: "400px", width: "100%" }} center={latLng} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
}
