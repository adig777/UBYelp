import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
} from "react-router-dom";
//import FullList from './components/FullList';
import Loginpage from './components/Loginpage';
import SearchBar from './components/SearchBar/SearchBar';
import TestTransferId from './components/TestTransferId';

function App() {
    return (
        <>
            <Router>
                <Routes>
                    <Route path='/' element={<Loginpage/>}/>
                    <Route path='/search' element={<SearchBar />} />
                    <Route path='/test' element={<TestTransferId />} />
                </Routes>
            </Router>
        </>
    );
}

export default App;
