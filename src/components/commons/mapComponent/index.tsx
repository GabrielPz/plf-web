import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./map'),{
    ssr: false
});

export default Map;

// import { LatLngTuple } from 'leaflet';
// import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'


// export default function Map(){
//     return(
//         <MapContainer style={{ height: "400px", width: "100%" }} center={[-38.505, -37.658]} zoom={13} scrollWheelZoom={false}>
//             <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             />
//         </MapContainer>
//     )
// }