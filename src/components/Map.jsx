import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export function Map({ latitude, longitude }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  if (!isLoaded) return <p>Carregando mapa...</p>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '300px' }}
      center={{ lat: latitude, lng: longitude }}
      zoom={15}
    >
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
}
