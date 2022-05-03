/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ThemeSetter from "./ThemeSetter";
import "./Settings.css";
import ThemeProvider from "./Themes/ThemeProvider";
import { TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import {useLocation} from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button"


function Settings(){
    const { state } = useLocation();
    const { account_id } = state;
    const navigate = useNavigate();
    const[distance, setdistance] = useState(100)
    const[rating, setrating] = useState(5)
    const[price, setprice] = useState('')
    const[one, setone] = useState(false)
    const[two, settwo] = useState(false)
    const[three, setthree] = useState(false)
    const[four, setfour] = useState(false)
    const[open, setopen] = useState(1)
    const[inlist, setinlist] = useState('')
    const[notinlist, setnotinlist] = useState('')
    const[listName, setlistnames] = useState([])
    const[id, setid] = useState(account_id)
    const[initialized, setinitialized] = useState(false)

    function initialize(){  
        if(!initialized){
            fetch('http://localhost:3001/listnames', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: JSON.stringify({
                    'id': id
                })
            }).then((response) => response.json()
            ).then((names) => {
                setlistnames(names)
            });

            fetch('http://localhost:3001/defaultfilters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: JSON.stringify({
                    'id': id
                })
            }).then((response) => response.json()
            ).then((filters) => {
                if(filters !== null){
                    setdistance(filters.distance);
                    setrating(filters.rating);
                    setprice(filters.price);
                    setopen(filters.open);
                    setinlist(filters.in_list);
                    setnotinlist(filters.not_list);
                    if(price.length>0){
                        const prices = price.split(",")
                        if(prices.includes('1')){
                            setone(true)
                        }
                        if(prices.includes('2')){
                            settwo(true)
                        }
                        if(prices.includes('3')){
                            setthree(true)
                        }
                        if(prices.includes('4')){
                            setfour(true)
                        }
                    }
                }
            });

            
            setinitialized(true)
        }
    }

    function HandleSave(e){
        fetch('http://localhost:3001/setdistance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'newFilter': distance
            })
        }).then((response) => response.json()
        ).then((res) => {    
            console.log('setdistance succesful');
        });

        fetch('http://localhost:3001/setrating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'newFilter': rating
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setrating succesful');
        });

        let text = ''
        if(one){
            if(!two && !three && !four){
                text = (text + '1');
            }else{
            text = (text + '1,') 
            }
        }
        setprice(text)
        if(two){
            if(!three && !four){
              text = (text + '2');
            }else{
              text = (text + '2,');
            }
        }
        setprice(text)
        if(three){
            if(!four){
              text = (text + '3');
            }else{
              text = (text + '3,');
            }
        }
        setprice(text)
        if(four){
          text = (text + '4');
        }
        setprice(text)

        fetch('http://localhost:3001/setprice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'newprices':price
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setpricerange succesful'); 
        });

        fetch('http://localhost:3001/setopen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'newFilter': open
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setopen succesful'); 
        });

        fetch('http://localhost:3001/setinlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'listName': inlist
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setlist successful'); 
        });

        fetch('http://localhost:3001/setnotlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'listName': notinlist
            })
        }).then((response) => response.json()
        ).then((res) => {    
            console.log('setnotlist successful');
        });
    e.preventDefault();
    }


    function renderlistnames(){
        return Object.keys(listName).map(name => {
            return (
                <option>{name}</option>
            );
        });
    }

    function Handlecheckbox1(e){
        const check = e.target.checked
        setone(check)
    }
    function Handlecheckbox2(e){
        const check = e.target.checked
        settwo(check)
    }
    function Handlecheckbox3(e){
        const check = e.target.checked
        setthree(check)
    }
    function Handlecheckbox4(e){
        const check = e.target.checked
        setfour(check)
    }

        return(
            <div className='settings'>
                <div className="NavBar">
                UBYELP
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/search', { 'state': { 'account_id': account_id } }) }}>
                    Search
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/lists', { 'state': { 'account_id': account_id } }) }}>
                    Lists
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/about', { 'state': { 'account_id': account_id } }) }}>
                    About us
                </Button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/settings') }}>
                    Settings
                </Button>
            </div>
                
                {initialize()}
            
                <h1>
                    Settings
                </h1>
                <div>
                    Select Default Filters:&nbsp;&nbsp;
                <Button onClick={(e) => HandleSave(e)}>
                Save
                </Button>
                </div>
                <div className = 'distance'>
                    Select Default Distance: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Enter in Miles..1-40000"
                    onChange = {(e) => setdistance(e.target.value)}
                    value = {distance}
                    />
                </div>
                <div className = 'open'>
                    Only show places that are open? 
                    Yes <input type="radio" value={1} name="open" onClick = {(e) => setopen(e.target.value)}/> 
                    <input type="radio" value={0} name="open" onClick = {(e) => setopen(e.target.value)}/> No
                </div>
                <div className = 'rating'>
                    Select Default Rating Filter: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "0-5"
                    onChange = {(e) => setrating(e.target.value)}
                    value = {rating}
                    />
                </div>
                <div className = 'price'>
                    Select Default Price Range: 
                    
          <input
            onChange={(e) => Handlecheckbox1(e)}
            type="checkbox"
            name="filters"
            value={one}
          />
          &nbsp;&nbsp;
           $$
          <input
            onChange={(e) => Handlecheckbox2(e)}
            type="checkbox"
            name="filters"
            value={two}
          />
          &nbsp;&nbsp;
           $$$
          <input
            onChange={(e) => Handlecheckbox3(e)}
            type="checkbox"
            name="filters"
            value={three}
          />
          &nbsp;&nbsp;
           $$$$
          <input
            onChange={(e) => Handlecheckbox4(e)}
            type="checkbox"
            name="filters"
            value={four}
          />
                </div>
                <div className = "DefaultList">
                    Select Which Lists to Include/Exclude: 

                    <select id="inList" className="SearchBar-dropdown" onChange={(e) => setinlist(e.target.value)}>
                        <option value="">Include</option>
                        {renderlistnames()}
                    </select>
                    <select id="inList" className="SearchBar-dropdown" onChange={(e) => setnotinlist(e.target.value)}>
                        <option value="">Exclude</option>
                        {renderlistnames()}
                    </select>
                    
                </div>
                
                
                <ThemeProvider>
                    <div className="themeSwitch">
                    Light/Dark Theme:&nbsp;&nbsp;
                    <ThemeSetter/>
                    </div>
                </ThemeProvider>
                </div>
        );
    }








  export default Settings;
