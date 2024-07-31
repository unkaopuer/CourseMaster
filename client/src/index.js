import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import App from './App';
import theme from './theme';

const HotApp = hot(App)*
ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
      <ThemeProvider theme={theme}>
      <Routes>
        <Route path = "/*" element = {<HotApp />} />
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


