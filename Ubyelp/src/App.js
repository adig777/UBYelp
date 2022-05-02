import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
} from "react-router-dom";
//import FullList from './components/FullList';
import Loginpage from './components/Login/signin';
import SearchBar from './components/SearchBar/SearchBar';
import TestTransferId from './components/TestTransferId';
import Signup from './components/Signup/signup';
import BusinessList from './components/BusinessList/BusinessList';
import Settings from './components/Settings/Settings';
import Lists from './components/List/Lists';
import Home from './components/Home/about';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<Loginpage/>}/>
                    <Route path='/search' element={<SearchBar />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/results' element={<BusinessList />} />
                    <Route path='/settings' element={<Settings />} />
                    <Route path='/lists' element={<Lists />} />
                    <Route path='/about' element={<Home />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
