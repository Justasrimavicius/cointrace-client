import React, { useEffect, useState } from "react";
import LoggedInApp from "./LoggedInApp";
import UnauthorizedApp from './UnauthorizedApp'

import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material";

function App(){

  const theme = createTheme({
    palette: {
      primary: {
        main: '#000000',
        light: '#d3d3d3',
      },
      secondary: {
        main: '#f2a900',
        dark: '#f29500',
        light: '#f2bd00',
      },
    },

    typography: {
      h5: {
        fontWeight: 'bold'
      }
    }
  });


    return(
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route exact path="/" element={<UnauthorizedApp />} />
            <Route exact path='/LoggedInApp' element={<LoggedInApp />} />
          </Routes>
        </Router>
      </ThemeProvider>
    )
}

export default App;