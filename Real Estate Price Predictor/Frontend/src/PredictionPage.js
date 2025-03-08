const BACKEND_URL = "https://ai-real-estate-price-predictor-production.up.railway.app";

//the prediction page consisting displayign predicted price based on user input feature, map of melbourne and three charts usign chart.js
import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Fade, CircularProgress, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bar, Line } from 'react-chartjs-2';
import MapComponent from './MapComponent';//impornt teh mapcomponent.js to be used to dispaying the map
import {
  Chart as ChartJS,//import chart.js for our 
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);//get relevant component used such as legent title etc 

function PredictionPage() { //create prediction page component 
  const currentLocation = useLocation();
  const navigateFunction = useNavigate();
  const { formData: submittedFormData } = currentLocation.state || {};//extract form data from locaiton 
  
  const [calculatedPredictedPrice, setCalculatedPredictedPrice] = useState(null);//set state for predicted price 
  const [animatedDisplayedPrice, setAnimatedDisplayedPrice] = useState(0);//state for animated price that runs up durign prediction 
  const [predictionErrorMessage, setPredictionErrorMessage] = useState(null);//prediction errro message state 
  const [isPredictionLoading, setIsPredictionLoading] = useState(true);//set state we created a loading indicator until the results are presented
  
  const [propertyChartsData, setPropertyChartsData] = useState({//state for charts including bar chart, line chart for rooms and line chart for distance, empty arrays for labels, and dataset 
    barChartData: { labels: [], datasets: [] },
    lineChartRoomsData: { labels: [], datasets: [] },
    lineChartDistanceData: { labels: [], datasets: [] }, 
  });

  // we kept running into issues with bar charts legend swapping causing inconsistnacy between the three charts so we defined the order for each chart, each chart inlcudes predicted price in the legend aswell
  //bar chart for average price for each property type 
  const barChartLegendOrder = [
    'Average Price for each Property Type',
    'Your Predicted Price', 
  ];

  // line chart for average price for number of rooms 
  const lineChartRoomsLegendOrder = [
    'Average Price for Number of Rooms',
    'Your Predicted Price', 
  ];

  // line chart for avergae price by distance 
  const lineChartDistanceLegendOrder = [
    'Average Price by Distance',
    'Your Predicted Price', 
  ];

  // configuring the bar chart feature scales and design with and addressed the  legend swapping issue by setting order of legends, also ensured repsonsiveness
  const barChartConfigurationOptions = {
    responsive: true, // set responsve to true for responsiveness small displays 
  scales: {
    y: { //y axis
   stacked: false,//ensure the y axis insnt stakced 
        ticks: {
          color: '#333',//set colour to grey 
        },
      title: {
        display: true,
          text: 'Price ($)',//label the y axis price ($)  
          color: '#333',
        font: {
          size: 16,
          },
        },
      },
    x: { //x axis 
       ticks: {
         color: '#333', //grey 
        },
      title: {
        display: true,
        text: 'Property Type',//set the label 
          color: '#333',
          font: {
          size: 16,
        },
        },
    },
    },
    plugins: {
      legend: {// designing the legend for the bar graph 
        display: true,
        labels: {
          color: '#333', //set the text to light grey 
          font: {
         size: 14,
          },
          usePointStyle: true,
          boxWidth: 15,
          // as mentioned ealrier had issues with legends swapping creating inconsistancy we first attempted creating a whole new function however it kept conflicting causing other issues with charts hence we used a new cursom sort function to created a predefined order we did the same for the rest of the charts  
          sort: (a, b) => {
            const orderA = barChartLegendOrder.indexOf(a.text);//create index for a and b 
            const orderB = barChartLegendOrder.indexOf(b.text);
            return orderA - orderB;//sort the order for the legend  
          },
        },
      },
      tooltip: {// when hovering over data point in the cart for exmaple displaying 'average price of property type: $979,826.38' when hoving over 
     callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }

            if (context.parsed.y !== null) {
              // Ensure two decimal places in tooltip
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });//ensure rounded to 2 decimal points 
            }
            return label;
          }
        }
      }
    },
  };

  // similar to above customisation of scales however for the rooms line chart
  const lineRoomsChartConfigurationOptions = {

    responsive: true, // set to true for responsiveness
    scales: {
      y: {//y axis 
      ticks: {
        color: '#333',//grey colour for y axis 
        },
        title: {//customising title 
        display: true,
          text: 'Price ($)',
        color: '#333',//also set titel to grey colour 
          font: {
            size: 16,
          },
        },
      },
      x: {//x axis 
        ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Number of Rooms',//set label to 'number of rooms' 
        color: '#333',
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
      display: true,
        labels: {
        color: '#333',//again light grey colour is used 
        font: {
            size: 14,
          },
          usePointStyle: true,
          boxWidth: 15,
          // again using sort  function  ensuring the legend order is in the right orientation
          sort: (a, b) => {
            const orderA = lineChartRoomsLegendOrder.indexOf(a.text);
          const orderB = lineChartRoomsLegendOrder.indexOf(b.text);
            return orderA - orderB;
      },
      },
      },
      tooltip: { //configuring when user hovers over lien graph
        callbacks: {
          label: function(context) {
           let label = context.dataset.label || '';
          if (label) {
              label += ': ';
            }
          if (context.parsed.y !== null) {
              // ensure two decimal places in tooltip
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
          }
        }
      }
    },
  };

  // chart configuration for distance line chart ensuring responsiveness and customising legend order
const lineDistanceChartConfigurationOptions = {
    responsive: true, // set  responsiveness to true 
  scales: {//setting scales 
      y: {//y aixxis 
        stacked: false,
      ticks: {
          color: '#333',
        },
      title: {
          display: true,
          text: 'Price ($)',
        color: '#333',
          font: {
            size: 16,
          },
        },
      },
      x: {// setting x axis 
      ticks: {
          color: '#333',
        },
        title: {
          display: true,
          text: 'Distance',
          color: '#333',
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
      display: true,
      labels: {
          color: '#333',
          font: {
            size: 14,
          },
          usePointStyle: true,
          boxWidth: 15,
          // ensuring the order is of legends is set correctly for consistancy sake using  sort function 
          sort: (a, b) => {
          const orderA = lineChartDistanceLegendOrder.indexOf(a.text);
           const orderB = lineChartDistanceLegendOrder.indexOf(b.text);
          return orderA - orderB;
          },
        },
      },
      tooltip: {//hovering over data charts and retrieving labels  
        callbacks: {
       label: function(context) {
          let label = context.dataset.label || '';
           if (label) {
              label += ': ';
            }
          if (context.parsed.y !== null) {
              // when hoverign over price is rounded to two decimal places 
              label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            return label;
       }
      }
      }
    },
  };
  useEffect(() => { //fetching predicted price based on user input submitted from the form  
    const fetchPredictedPrice = async () => { //async fucntion fetches predcited price 
    if (!submittedFormData) {//check fi the form data is present if not display error 
     setPredictionErrorMessage('no data present');
     setIsPredictionLoading(false);
        return;
      }
      try {//make request to server to fetch the predicted price, using /predict endpoint  
      const predictionResponse = await fetch('http://localhost:8000/predict', {//uses the fetch api to, await pauses the the operation until response is received 
          method: 'POST',//post method deifined 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submittedFormData), //convert the user's input data into a json string format as fetch api request body to be a string when sending json data 
        });

      if (predictionResponse.ok) { //check if the prediction reponse 
        const predictionResult = await predictionResponse.json();//parse the repsonse to json format 
          // we realised the predicted price has trailing number so rounded the predicted price to two decimal places
          const roundedPredictedPrice = parseFloat(predictionResult.predicted_price.toFixed(2));
          setCalculatedPredictedPrice(roundedPredictedPrice);
          setPredictionErrorMessage(null);//clear teh errro message when prediction suscessfully retrieved 
        } else {//if there is an issue retrieving the price prediction erorr message server repsonds with an error status 
          setPredictionErrorMessage('sorry here was an error getting the price prediction');
        }
      } catch (error) {//if genreal error arrise such as network error etc eorror message is given 
        console.error('Error:', error);
        setPredictionErrorMessage('there was an error fetching the predicted price.');
      } finally {
        setIsPredictionLoading(false);
      }
    };
    fetchPredictedPrice();//retrieve the predicted price from api
  }, [submittedFormData]);//if the user submits a form with new data the fetch predcicted price function will be re run 

  useEffect(() => {//similar to fetchign the predicted price, use effect is used for fetching the dataset (data.csv) from backend for chart data
    const fetchPropertyChartData = async () => {
      try {
        const dataResponse = await fetch('http://localhost:8000/data');//fetch data from the api 
        const fetchedChartData = await dataResponse.json();//parse response JSON 

        // calcaulte the average price by property type
        const propertyTypePrices = fetchedChartData.reduce((accumulator, currentProperty) => {//group prices y=by type 
           const propertyType = currentProperty.Type;//get the property type 
          const propertyPrice = parseFloat(currentProperty.Price);//get the property price 
          if (!isNaN(propertyPrice)) { //ensure the price is a number using isNAN 
            accumulator[propertyType] = accumulator[propertyType] ? [...accumulator[propertyType], propertyPrice] : [propertyPrice];//acccumilate the prices 
          }
          return accumulator;
        }, {});
 
        const averagePricePerPropertyType = Object.keys(propertyTypePrices).map((propertyType) => ({ 
          type: propertyType,//define the property type eg hosue, townhouse or unit  
          avgPrice:
            propertyTypePrices[propertyType].reduce((total, price) => total + price, 0) / propertyTypePrices[propertyType].length,//avergae price is calculted by summing the prices and dividing by count 
        }));

        // calcaulte the average price by number of rooms 
        const averagePricesByRoomCount = fetchedChartData.reduce((accumulator, currentProperty) => {
          const numberOfRooms = parseInt(currentProperty.Rooms, 10);//convert teh room count into an integer 
          const propertyPrice = parseFloat(currentProperty.Price);//ensure price is converted to float 
        if (!isNaN(propertyPrice)) {//ensure property price is a number 
          accumulator[numberOfRooms] = accumulator[numberOfRooms] ? [...accumulator[numberOfRooms], propertyPrice] : [propertyPrice];// group by room count 
          }
          return accumulator;
        }, {});

        const sortedRoomCounts = Object.keys(averagePricesByRoomCount).sort(//ensure room counts are sorted in accending order eg 1 to 7
            (a, b) => a - b
          );

        // categorieze distances bins into differnt categories 0-5, 5-10, this made our distance chart look much more understandable as comapred to before where each indivdual distance and price is represented as indivdual points e.g 1,2,3,4,km etc 
        const distanceCategoryBins = [
          { label: '0-5 km', min: 0, max: 5 },
         { label: '5-10 km', min: 5, max: 10 },
          { label: '10-15 km', min: 10, max: 15 },
         { label: '15-20 km', min: 15, max: 20 },
          { label: '20+ km', min: 20, max: Infinity }, 
        ];

        // compute the average property price for each distance category bin 
        const averagePricePerDistanceCategory = distanceCategoryBins.map(bin => {

          const pricesInBin = fetchedChartData

            .filter(property => parseFloat(property.Distance) >= bin.min && parseFloat(property.Distance) < bin.max)
            .map(property => parseFloat(property.Price))
            .filter(price => !isNaN(price));//ensure the all te prices are valid numbers usign isNAN 
          const avgPrice = pricesInBin.length > 0
            ? parseFloat((pricesInBin.reduce((total, price) => total + price, 0) / pricesInBin.length).toFixed(2))
            : 0;
          return { bin: bin.label, avgPrice };
        });

        // we ideetnify what category the users predicted price falls in based on distance 
        const userPredictedDistance = parseFloat(submittedFormData.Distance); //user inputs for distance 
        const userPredictedPrice = calculatedPredictedPrice; //users calcaulteed price 
        let userPredictedPriceDistanceBinIndex = distanceCategoryBins.findIndex(
          bin => userPredictedDistance >= bin.min && userPredictedDistance < bin.max
        );

        // fallback in case userPredictedDistance doesn't fall into any categry bin althoguh shouldnt happen as we restricted user input to 0 to 50km and left teh last cateogry form 0 to infinty in case 
        if (userPredictedPriceDistanceBinIndex === -1) {
          userPredictedPriceDistanceBinIndex = distanceCategoryBins.length - 1; // assign to '20+ km' category incase
        }

        // design the data for distance chart includng the predicted price pinpoint star on the chart 
      const distanceChartData = {
         labels: distanceCategoryBins.map(bin => bin.label),
          datasets: [
            {
              label: 'Average Price by Distance',
              data: averagePricePerDistanceCategory.map(d => d.avgPrice),
              borderColor: '#FF0000', // we used red colour to suit the scheme of the website 
              backgroundColor: '#FF0000',
              fill: false,
              pointRadius: 5,
              order: 1, //set the order to the pinpoint star of 'your predicted price' is stil visbale
            },
            {
            label: 'Your Predicted Price', // predicted price star pinpoint  
            data: distanceCategoryBins.map((bin, index) =>
                index === userPredictedPriceDistanceBinIndex ? userPredictedPrice : null
              ),
              type: 'line',
                borderColor: '#006400', // set to dark green colour to math the colour of the predicted price display at the top of the page 
              backgroundColor: '#006400',
              borderWidth: 3,
                pointRadius: 10,
                hoverRadius: 12,
              pointBackgroundColor: '#006400',
                pointStyle: 'star',//set the pointer style ot star 
              showLine: false,
              order: 0,// set the order to the star is visiable ie not hiding behind anything on the chart 
            },
          ],
        };

        // designig bar chat 
        const propertyTypeBarChartData = {
        labels: ['House', 'Townhouse', 'Unit'], //create the labels for the bar chart 
          datasets: [
            {
              label: 'Average Price of Property Type',
              data: averagePricePerPropertyType.map((d) => d.avgPrice),
              backgroundColor: ['#FF4C4C', '#FF0000', '#CC0000'], // used differnt  shades of red in order ot mathc the scheme of the website 
              borderColor: ['#FF4C4C', '#FF0000', '#CC0000'], // ensurie the boarder colour is the same 
              borderWidth: 1,
              order: 1, // render the bar graph second as we had issues where the pinpoint star of the 'your predicted price' getting hidded behind bars
            },
            {
              label: 'Your Predicted Price', // predicted price pinpoint star
              data: averagePricePerPropertyType.map((d) =>
                submittedFormData.Type === d.type ? userPredictedPrice : null
              ),
              type: 'line',
              borderColor: '#006400', // ensure dark green colour to maintian cosnsitancy 
              backgroundColor: '#006400',
            borderWidth: 3,
              pointRadius: 10,
                hoverRadius: 12,
              pointBackgroundColor: '#006400',
            pointStyle: 'star',//star shape of the pinpoint 
              showLine: false,
              order: 0, // rendering the star first to appear above the bar instead of behind it, sound counter intutative however after throough testing this was the only way we could get teh pinpoint to appear ontop of the bars 
            },
          ],
        };

        // designing the average price per room chart 
        const roomsChartData = {
          labels: sortedRoomCounts,
          datasets: [
            {
              label: 'Average Price for Number of Rooms',
              data: sortedRoomCounts.map(
                (room) =>
                  parseFloat((averagePricesByRoomCount[room].reduce((total, price) => total + price, 0) / averagePricesByRoomCount[room].length).toFixed(2))//access the array of apprices assocaited with teh room number, and specific numebr o frooms eg 1,2,3,4,5,6,7 
              ),
              borderColor: '#FF0000', // ensure red colour 
              backgroundColor: '#FF0000',
                fill: false,
              pointRadius: 5,
              order: 1, // again we render the star pinpoint second as we ran into issesus with teh pinpoint being hidden behind the bars 
            },
            {
              label: 'Your Predicted Price', // predicted price pinpoint 
              data: sortedRoomCounts.map((room) =>
                submittedFormData.Rooms === parseInt(room, 10) ? userPredictedPrice : null //convert room count it integer and matches hte number of rooms inputted by user and also return the predicted price 
              ),
              type: 'line',
              borderColor: '#006400', // dark green color of the pinpoint
              backgroundColor: '#006400',
              borderWidth: 3,
              pointRadius: 10,
              hoverRadius: 12,
              pointBackgroundColor: '#006400',
              pointStyle: 'star',//star pinpoint 
              showLine: false,
              order: 0, // render the price pinpoint first to appear above
            },
          ],
        };
        // update the data for all the three charts 
        setPropertyChartsData({
          barChartData: propertyTypeBarChartData,
          lineChartRoomsData: roomsChartData,
          lineChartDistanceData: distanceChartData, 
        });
      } catch (error) {
        console.error('issue loading data into charts', error);
      }
    };

    if (calculatedPredictedPrice !== null) {//if the predicted price exists and is created then the chart data is fetched 
      fetchPropertyChartData();
    }
  }, [calculatedPredictedPrice, submittedFormData]);

  // decided to implemnt animation effect fro displayng the predicted price making it slowly go up in value to the actual predicted price looks like the numbers are running up 
  useEffect(() => {
    if (calculatedPredictedPrice !== null) {//checks if the predicted price exists 
      let currentDisplayedPrice = 0;//starts the display from zero and then will run up in value 
      const priceIncrementStep = Math.ceil(calculatedPredictedPrice / 50);//increments upwards in steps 
      const animationInterval = setInterval(() => {
      currentDisplayedPrice += priceIncrementStep;//incremently increase the displayed price 
      if (currentDisplayedPrice >= calculatedPredictedPrice) {//ensure to stop teh animation once the actual predicted price is reached 
          clearInterval(animationInterval);
            setAnimatedDisplayedPrice(calculatedPredictedPrice);//set the final predicted price 
          } else {
          setAnimatedDisplayedPrice(currentDisplayedPrice); 
        }
      }, 20); //animation speed is in millisecodns 
      return () => clearInterval(animationInterval); // ensure to clear up animation interval 
    }
  }, [calculatedPredictedPrice]);

  return (//create the loading spinner ensures the user isnt confused when nothing appears on the screen, also display the map with eth submitted postocde 
    <Container component="main" sx={{ mt: 8, mb: 2, flex: 1 }}>
     <Fade in timeout={1000}>
        <Box>
       {isPredictionLoading && (
             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
            </Box>
          )}

         {calculatedPredictedPrice !== null && !isPredictionLoading && (//display the predicted price if it is availble 
            <>
              <Typography
                variant="h3"
                sx={{ mt: 4, mb: 4, textAlign: 'center', color: 'green', fontWeight: 'bold' }}
              >
                Predicted Price: ${animatedDisplayedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>

              <MapComponent postcode={submittedFormData.Postcode} />

              {/* display teh bar chart with average price by property type if availble */}
              {propertyChartsData.barChartData.datasets.length > 0 && (//checking if any data is available for the chart same method is used for the other charts below
                <Box sx={{ mt: 4 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Price Distribution by Property Type
              </Typography>
                  <Bar
                    data={propertyChartsData.barChartData}
                      options={barChartConfigurationOptions}
                  />
                </Box>
              )}
              {/* display the line chart with average price for number of rooms */}
              {propertyChartsData.lineChartRoomsData.datasets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                 <Typography variant="h6" align="center" gutterBottom>
                    Average Price for Number of Rooms
                  </Typography>
                  <Line
                  data={propertyChartsData.lineChartRoomsData}
                      options={lineRoomsChartConfigurationOptions}
                />
                </Box>
              )}

              {/* line chart that has average price by distance */}
            {propertyChartsData.lineChartDistanceData.datasets.length > 0 && (
                <Box sx={{ mt: 4 }}>
                <Typography variant="h6" align="center" gutterBottom>
                    Average Price by Distance
                    </Typography>
                   <Line
                    data={propertyChartsData.lineChartDistanceData}
                  options={lineDistanceChartConfigurationOptions}
                  />
                </Box>
              )}
            </>
          )}

          {predictionErrorMessage && (//display an eror if the prediction fails 
            <Typography color="error" sx={{ mt: 4 }}>
              {predictionErrorMessage}
            </Typography>
          )}

          {/* create the back button to return ot the form, we used navigateFunction -1 as it was the easies to implemtn and ran into odd issues using another method*/}
         <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => navigateFunction(-1)}>
              Back
            </Button>
           </Box>
      </Box>
      </Fade>
   </Container>
  );
}

export default PredictionPage;
