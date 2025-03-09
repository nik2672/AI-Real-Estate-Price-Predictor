// Our user form page for users to input room , house type, postcode, distance from city 
import React, { useState } from 'react';
import {//import relevent components used
  Container,
  Box,
  Typography,
  Fade,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';//import usenavigate in order to use react router 
//asssigned empty string usign usestate for each user input for rooms, type, postcode, distance
function PredictionForm() {
  const [numberOfRooms, inputTheNumberOfRooms] = useState('');
  const [propertyType, inputThePropertyType] = useState('');
  const [propertyPostcode, inputThePropertyPostcode] = useState('');
  const [distanceFromCity, inputTheDistanceFromCity] = useState('');
  const navigationFunction = useNavigate();//NavigationFunction used to retieect users to differnt pages for isntance the predictionPage.js 
  const handleFormSubmission = (event) => {//event handler for relvent data
    event.preventDefault();//prevent default behaviour stopping teh from from beign submitted without casuign the page to fully reload 

    const currentForm = event.currentTarget;//event object is passed when the form is submitted 
    if (!currentForm.checkValidity()) {//checks if all the form is valid ensuring all fields are filled our correctly and accoridng to constriants scuh as rooms 1-7 
      // if the form is invalid, let the browser display the errors
      currentForm.reportValidity();
      return;
    }

    // prepare the data for submission
    const formSubmissionData = {//holdd data collected by the form soring collected fields
      Rooms: parseInt(numberOfRooms, 10),//10 indicating the numebr should be parsed as a decimal base 10 integier 
      Type: propertyType,
      Postcode: parseInt(propertyPostcode, 10),
      Distance: parseFloat(distanceFromCity),
    };
    console.log("Form submission data:", formSubmissionData); //  check formSubmissionData is correct before navigation

    // Navigate to /predict  with the prepared data
    navigationFunction('/prediction', { state: { formData: formSubmissionData } });
  };
//designing the form and also implemnt user validation constraints on what the usre can input, fade in effect is also added (1000)
  return (
    <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>
      <Fade in timeout={1000}>
        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Real Estate Price Prediction
        </Typography>
          <Typography variant="body1" gutterBottom>
            Enter the details below to get an estimated price for the property using our neural network model.
            </Typography>
          <form onSubmit={handleFormSubmission}>
            <TextField
              required
                label="Number of Rooms"
                type="number"
              value={numberOfRooms}
              onChange={(e) => inputTheNumberOfRooms(e.target.value)}
            fullWidth
              margin="normal"
              inputProps={{
             min: 1,//rooms can only be between 1 and 7, we changed it so the error message is handled by the browser only eg.'Please select a value no more than 7 or not less than 1'
            max: 7,
              step: 1,
              }}
            />
            <TextField
              required
              select
            label="House Type"
              value={propertyType}
              onChange={(e) => inputThePropertyType(e.target.value)}
              fullWidth
              margin="normal"//Drop down menu allowing user to select house, townhouse and unit also ensuing the value si h,t,u fro backend processing 
              >
                <MenuItem value="h">House</MenuItem>
              <MenuItem value="t">Townhouse</MenuItem>
              <MenuItem value="u">Unit</MenuItem>
            </TextField>
            <TextField
              required
            label="Postcode"
              type="text"
              value={propertyPostcode}
              onChange={(e) => inputThePropertyPostcode(e.target.value)}
            fullWidth
              margin="normal"//postcode with patter defined to ensure only four digits are entered 
              inputProps={{
                 pattern: "\\d{4}",
                title: "Postcode must be exactly 4 digits.",
                inputMode: "numeric",
                  maxLength: 4,
              }}
            />
            <TextField
              required
              label="Distance from City (km)"
            type="number"
                value={distanceFromCity}
              onChange={(e) => inputTheDistanceFromCity(e.target.value)}
            fullWidth
              margin="normal"
              inputProps={{//ensuring the distance entered is between 1 and 50 also defining step so traling decimals can also be inputted for precision
               min: 1,
                max: 50,
                step: 0.1,
              }}//created submission button with label reading 'predict price' 
            />
            <Button
              type="submit"
             variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Predict Price
              </Button>
          </form>
       </Box>
      </Fade>
    </Container>
  );
}

export default PredictionForm;
