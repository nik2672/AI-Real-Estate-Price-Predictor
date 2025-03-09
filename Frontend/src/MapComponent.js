//we createed an interactive map using OpenCage API, we also included the feature where the users postcode is pinpointed
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';//import the leaflet to create teh graph  
import 'leaflet/dist/leaflet.css';
import { Typography, Box } from '@mui/material'; // import Typography and Box

// define a red marker icon
const redMarkerIcon = new L.Icon({   
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png', // ensured the marker for postocde is red to match the read scheme of the website
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
  
});

function MapComponent({postcode }) {
  const [coordinates, setCoordinates] = useState({ lat: -37.8136, lng: 144.9631 }); // ensure it defaults to melbourne cbd using lat and lng 

  useEffect(() => {//use effect hook for pinpointing the postcode 
    const getCoordinates = async () => {
      try {
        const response = await fetch(//fetches the grographical location based on the provided postode requesting to Opencage 
          `https://api.opencagedata.com/geocode/v1/json?q=${postcode},Australia&key=c561a3eedffe482fa6d33d8553b0d864`//prvide opencage the postcode, so it is converted to geographical coordinates
        );
        const data = await response.json();//await pauses the getcoordiantes until the fetch request is completed 

        if (data.results && data.results.length > 0) {//checks if data object contains the results andn whather is legnth is greater than zero
          const location = data.results[0].geometry;//geomertry corodinates contains lat and logitude of location associated with the postcode
          setCoordinates({ lat: location.lat, lng: location.lng });//sets the coordnates usign lat and logitude and rerenders the component displaying the new coordinates 
        } else {
          console.error('results not found for this postcode.');//error message for if the postcode is not foudn  
        }
      } catch (error) {
        console.error('issue getting and fetching coordinates:', error);//catches any unforseen erros that occured with fetching the coordinates
      }
    };
//ensures getcoordinates () is only called if postcode is not empty 
    if (postcode) {
      getCoordinates()
    }
  }, [postcode]);
//postcode location title above the map aswell as resize the map to zoom level of 10 to ensure users can see the map of cbd clearly and position the marker 
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" align="center" gutterBottom>
        Postcode Location
      </Typography>
      <MapContainer center={[coordinates.lat, coordinates.lng]} zoom={10} style={{ height: '400px', width: '100%' }}> 
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // leaft the leflet copy wright info so the map doesnt keep breaking
              attribution="&copy; OpenStreetMap contributors"
        />
      <Marker position={[coordinates.lat, coordinates.lng]} icon={redMarkerIcon} /> 
          </MapContainer>
   </Box>
  );
}
export default MapComponent;
