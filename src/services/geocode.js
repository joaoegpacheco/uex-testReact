import axios from 'axios';

export async function searchCoordinates(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`;

  const response = await axios.get(url);
  const location = response.data.results[0]?.geometry.location;
  return location; // { lat, lng }
}
