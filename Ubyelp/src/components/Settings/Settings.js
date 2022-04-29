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
import {useState} from "react";



function Settings(){
    const { state } = useLocation();
    const{account_id} = state;
    const[distance, setdistance] = useState(100)
    const[rating, setrating] = useState(5)
    const[maxprice, setmaxprice] = useState(5)
    const[minprice, setminprice] = useState(1)
    const[open, setopen] = useState(1)
    const[inlist, setinlist] = useState('')
    const[notinlist, setnotinlist] = useState('')
    const[listNames, setlistnames] = useState([])
    const[id, setid] = useState(account_id)

        
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
    
    function HandleSave(){
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

        fetch('http://localhost:3001/setpricerange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':id,
                'newMin': minprice,
                'newMax': maxprice
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
    function handledistance(e){
        const newdistance = e.target.value;
        setdistance(newdistance)
    }
    function handlerating(e){
        const newrating = e.target.value;
        setrating(newrating)
    }
    function handlemin(e){
        const newmin = e.target.value;
        setminprice(newmin)
    }
    function handlemax(e){
        const newmax = e.target.value;
        setmaxprice(newmax)
    }
    function handleopen(e){
        const newopen = e.target.value;
        setopen(newopen)
    }
    function handleinlist(e){
        const newinlist = e.target.value;
        setinlist(newinlist)
    }
    function handlenotinlist(e){
        const newnotinlist = e.target.value;
        setnotinlist(newnotinlist)
    }

    function handlechangein(SelectChangeEvent){
        
        inlist.setState(SelectChangeEvent.target.value)
    }


    function handlechangeout(SelectChangeEvent){
        notinlist.setState(SelectChangeEvent.target.value)
    }

    
        return(
            <div className='settings'>
                <h1>
                    Settings
                </h1>
                <div>
                    Select Default Filters:&nbsp;&nbsp;
                <a onClick={HandleSave}>
                Save
                </a>
                </div>
                <div className = 'distance'>
                    Select Default Distance: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Enter in Miles..."
                    onChange = {(e) => {handledistance}}
                    value = {distance}
                    />
                </div>
                <div className = 'open'>
                    Only show places that are open? 
                    Yes <input type="radio" value={1} name="gender"/> 
                    <input type="radio" value={0} name="gender"/> No
                </div>
                <div className = 'rating'>
                    Select Default Rating Filter: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "1-5"
                    onChange = {this.handlerating}
                    value = {rating}
                    />
                </div>
                <div className = 'price'>
                    Select Default Price Range: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Min..."
                    onChange = {this.handlemin}
                    value = {minprice}
                    />
                    &nbsp;
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Max..."
                    onChange = {this.handlemax}
                    value = {maxprice}
                    />
                </div>
                <div className = "DefaultList">
                    Select Which Lists to Include/Exclude: 
                    <Box sx={{ maxWidth: 120 }}>
                    <FormControl fullWidth>
                     <InputLabel id="demo-simple-select-label">Include</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={inlist}
                    defaultvalue = {listName}
                    label="InList"
                    onChange={handlechangein}
                >
                    {
                        listNames.map(listName) => (
                            <MenuItem
                            value = {listName}
                            key = {listName}
                            >
                            {listName}
                            </MenuItem>

                        );    
                    }
                    </Select>
                    </FormControl>
                    </Box>

                    <Box sx={{ maxWidth: 120 }}>
                    <FormControl fullWidth>
                     <InputLabel id="demo-simple-select-label">Exclude</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={notinlist}
                    defaultvalue = {notinlist}
                    label="InList"
                    onChange={handlechangeout}
                >
                    {
                        listNames.map(listName) => (
                            <MenuItem
                            value = {notinlist}
                            >
                            {listName}
                            </MenuItem>

                        );    
                    }
                    </Select>
                    </FormControl>
                    </Box>
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

