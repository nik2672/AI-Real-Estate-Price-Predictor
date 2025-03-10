// oru contact page listing team members
import React from 'react';
import { Container, Typography, Grid, Fade, Card, CardContent, CardMedia, Box } from '@mui/material';
import { Mail as MailIcon } from '@mui/icons-material'; // import the Mail icon

// we created a contact page listing our team members
function Contact() {
  const teamMembers = [

    {
      name: 'Ibrahim M Barmil',
      role: 'Team Member',
      email: '104490388@student.swin.edu.au',
      image: '/images/pic1.JPG',
    },
    {
      name: 'Nikhil Mohite',
      role: 'Team Member',
      email: '104549772@student.swin.edu.au',
      image: '/images/pic2.JPG',
    },


    {
      name: 'Ryan Horsfall',
      role: 'Team Member',
      email: '103098655@student.swin.edu.au',
      image: '/images/pic3.jpg',
    },
  ];
//ensured all images were responsive depednign on screen size, we also added fade in effect w time out (1000)
  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'center',  justifyContent: 'center',mb: 6, mt: 6 }}>
        <MailIcon sx={{ fontSize: 50, mr: 2, color: 'primary.main' }} /> {/* placed same mail icon used for the sidebar next to title */}

       <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold' }}>
          Contact Us

          </Typography>
      </Box>

      <Grid container spacing={4}>
       {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
         <Fade in timeout={1000}> 
              <Card>
            <CardMedia
                  component="img"
                 height="200"
                  image={member.image}
                    alt={member.name}
              />
               <CardContent>
                  <Typography variant="h5" component="div">
                    {member.name}

                  </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {member.role}

                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                </Typography>
               </CardContent>
            </Card>
            </Fade>
         </Grid>
        ))}
      </Grid>
 </Container>
  );
}

export default Contact;
