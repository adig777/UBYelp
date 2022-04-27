/* eslint-disable react/jsx-no-duplicate-props */
/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

import React from 'react';
import './appq.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route}
	from 'react-router-dom';
import About from './pages/about';
import SignIn from './pages/signin';
import SignUp from './pages/signup';

function App() {
return (
	<Router>
	<Navbar />
	<Routes>
    <Route path='/about' element={<About/>} />
		<Route path='/signin' element={<SignIn/>} />
		<Route path='/signup' element={<SignUp/>} />
	</Routes>
	</Router>
);
}

export default App;

