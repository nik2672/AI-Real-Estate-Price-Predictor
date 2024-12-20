// About.js
import React from 'react';
import { Container, Typography, Grid, Box, useTheme } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material'; // Import the Info icon

function About() {//created about function  
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* About titel also had the same info icon usign mui icons next to it, ensuring consistancy with the side bar icons  */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
        <InfoIcon sx={{ fontSize: 50, mb: 2, mr:1, color: theme.palette.primary.main }} /> {/* place the info icon  next to our about title */}
        <Typography
          variant="h3"
        component="h1"
          gutterBottom
        align="center"
          sx={{ fontWeight: 'bold' }}
        >
          About Us
        </Typography>
      </Box>

      {/* creating our story section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
        component="h2"
          gutterBottom
            sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Our Story
        </Typography>
        <Grid container spacing={6} alignItems="center">
          {/* text description for our story section   */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              Our project aims to explore and assess housing prices and market trends across various property types in Melbourne, Australia. By leveraging machine learning techniques, our team has developed an AI model designed to accurately predict house prices based on the features you desire for your dream home. Additionally, our model analyzes fluctuations in Melbourne's real estate market using carefully curated datasets.
            </Typography>
          </Grid>
          {/* our house image also ensured it is repsonsive to screen sizes   */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/images/house.jpg"
              alt="Modern house in Melbourne"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* teh AI model section */}
      <Box sx={{ mb: 8 }}>
        <Typography
            variant="h4"
          component="h2"
         gutterBottom
          sx={{ mb: 3, color: theme.palette.primary.main }}
        >
          Our AI Model
        </Typography>
        <Grid container spacing={6} alignItems="center">
          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
             component="img"
              src="/images/aimodel.jpg"
                alt="AI model visualization"
                sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
            {/* added caption for the second image reading 'from assginment 2 model.py  */}
            <Typography
              variant="caption"
              align="center"
              sx={{ display: 'block', mt: 1, color: theme.palette.text.secondary }}
            >
              From Assignment 2, neural.py model
            </Typography>
          </Grid>
          {/*  description content  */}
          <Grid item xs={12} md={6}>
            <Typography variant="body1" paragraph>
              We have developed our AI price prediction model through testing and comparing various models such as regression, classification, and neural networks, selecting the best to incorporate into our website. Our neural network uses a deep architecture utilizing three hidden layers, consisting of 128, 64, and 32 neurons respectively using RELU, allowing us to capture complex patterns in our data. By providing accurate price predictions, our model empowers users to make informed decisions, whether they are buyers, sellers, investors, or real estate professionals, helping them navigate the complexities of the housing market with greater confidence.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* the welcome  section  */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
     <Typography variant="body1" sx={{ maxWidth: 800, margin: '0 auto' }}>
            We welcome everyone to HighDistinctionOnly's real estate price prediction model. Whether you're a student, first home buyer, real estate agent, or just looking to explore our model, feel free to test and interact with our website—the only limit is the extent of your imagination.
      </Typography>
      </Box>
    </Container>
  );
}

export default About;
