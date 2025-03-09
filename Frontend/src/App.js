import React, { useState, useMemo } from 'react'; 
import {
  AppBar, Toolbar, Typography, Button, Box,//importing libraries using useState, useMemo hooks 
  Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton,
  Switch, Snackbar, Alert, Divider, Container
} from '@mui/material';

import {

  Menu as MenuIcon,//import icons from mui mateiral for the side bar icons and page icons
  AttachMoney as AttachMoneyIcon,
  Info as InfoIcon,
  Mail as MailIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,//brightnesss icon for darkmode

} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red } from '@mui/material/colors';//red colour for our accent 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
//importing our about, contanct form and predictionpage compoentns 
import About from './About';
import Contact from './Contact';
import PredictionForm from './PredictionForm';
import PredictionPage from './PredictionPage';

function App() {
  //create our side bar drawer using useState hook 
  const [drawerOpen, setDrawerOpen] = useState(false);//
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  //darkmode custom theme created with two modes dark and ligt mode
  const theme = useMemo(() => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
    
      main: red[500],//primary red theme retained 
      },
    },
  }), [darkMode]);

  //enabel toggling the sidebar drawer throguh taking the open perameter whcih si expeted to be true or false 
  const toggleDrawer = (open) => (event) => {

    if (
      event &&//allows tab and shift key to navigate aroudn sidebar refered using lab 9
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);

  };

//updates teh darkmode state, !darkMode negates the current valuae of darkmode if true then set false or if false set true 
  const handleDarkModeToggle = () => {
      setDarkMode(!darkMode);
       setSnackbarOpen(true);

  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') { //click away meaning if the user clicks outside of the bar it will close the bar
      return;
    }

    setSnackbarOpen(false);//closes the bar by setting to false

  };
//customise drawer contnet using box to contain content, creating button, users can select price prediction, contact pages
  const drawerContent = (
    <Box

      sx={{ width: 250 }}//adjust width 
      role="presentation"
      onClick={toggleDrawer(false)}//ensurign side panel is closed
      onKeyDown={toggleDrawer(false)}
    >
      <List> 
        <ListItem button component={Link} to="/" sx={{ color: theme.palette.primary.main }}>
          <ListItemIcon>

         <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
         </ListItemIcon>

         <ListItemText primary="Price Prediction" />
        </ListItem>
        <ListItem button component={Link} to="/about" sx={{ color: theme.palette.primary.main }}>
        <ListItemIcon>
        <InfoIcon sx={{ color: theme.palette.primary.main }} />
         </ListItemIcon>
       <ListItemText primary="About" />
        </ListItem>

        <ListItem button component={Link} to="/contact" sx={{ color: theme.palette.primary.main }}>
         <ListItemIcon>
         <MailIcon sx={{ color: theme.palette.primary.main }} />
         </ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItem>

      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemIcon sx={{ color: darkMode ? 'white' : 'inherit' }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary="Dark Mode" sx={{ color: darkMode ? 'white' : 'inherit' }} />
          <Switch checked={darkMode} onChange={handleDarkModeToggle} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
       <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="static" color="primary" enableColorOnDark>
            <Toolbar>
                <IconButton
                edge="start"
              color="inherit"
              aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>

              {/* had issues wiht making our top bar tab title 'real estate price predictior' ensured it is responsive  */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  textAlign: 'center',
                  [theme.breakpoints.up('sm')]: { position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
                }}
              >
                <Typography
               variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  }}
                >
                  Real Estate Price Predictor
                </Typography>
              </Box>

              {/* ensuring our button are right-aligned  */}
              <Box sx={{ marginLeft: 'auto', display: { xs: 'none', sm: 'block' } }}>
                <Button color="inherit" component={Link} to="/about">
                  About
                </Button>
                <Button color="inherit" component={Link} to="/contact">
                  Contact
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
          <Routes>
            <Route path="/" element={<PredictionForm />} />
          <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
              <Route path="/prediction" element={<PredictionPage />} />
          </Routes>

          {/* creating our footer section inclduing our team name, and we added facebook,insta and twitter icons to make it look professional also addign copy wright symbol */}
          <Box
            component="footer"
            sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto', textAlign: 'center' }}
          >
        <Container maxWidth="lg">
              <Typography variant="body1" align="center">
                Real Estate Price Predictor
                </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
                  {'© '}
                {new Date().getFullYear()} High Distinction Only Group 14 - 05
                </Typography>
           <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/icon1.png" alt="Facebook" style={{ width: 24, margin: '0 8px' }} />
                  </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/icon2.png" alt="Instagram" style={{ width: 24, margin: '0 8px' }} />
                </a>
                  <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/icon3.png" alt="X" style={{ width: 24, margin: '0 8px' }} />
                </a>
              </Box>
            </Container>
          </Box>
          <Snackbar /*auto hidingour side bar feature refreed to lab 08 task */
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              sx={{ width: '100%' }}
            >
              {darkMode ? 'Dark mode enabled!' : 'Light mode enabled!'}
            </Alert>
          </Snackbar>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
