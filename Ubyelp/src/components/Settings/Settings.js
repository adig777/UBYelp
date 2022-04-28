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



class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.pageTitle = "Settings";
        const{account_id} = this.state;
        this.state = {
                distance: 100,
                rating: 5,
                minprice: 1,
                maxprice: 5,
                open: 1,
                inlist: '',
                notinlist: '',
                listNames: [],
                id:account_id 
        }  
        
        fetch('http://localhost:3001/listnames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id': this.state.id
            })
        }).then((response) => response.json()
        ).then((names) => {
            this.setState({ listNames: names });
        });
    }
    HandleSave(e){
        fetch('http://localhost:3001/setdistance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':this.state.id,
                'newFilter': this.state.distance
            })
        }).then((response) => response.json()
        ).then((res) => {    
            console.log('setdistance succesful');
        });

        fetch('http://localhost:3001/setrating', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':this.state.id,
                'newFilter': this.state.rating
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setrating succesful');
        });

        fetch('http://localhost:3001/setpricerange', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':this.state.id,
                'newMin': this.state.minprice,
                'newMax': this.state.maxprice
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setpricerange succesful'); 
        });

        fetch('http://localhost:3001/setopen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':this.state.id,
                'newFilter': this.state.open
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setopen succesful'); 
        });

        fetch('http://localhost:3001/setinlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':this.state.id,
                'listName': this.state.inlist
            })
        }).then((response) => response.json()
        ).then((res) => {   
            console.log('setlist successful'); 
        });

        fetch('http://localhost:3001/setnotlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id':this.state.id,
                'listName': this.state.notinlist
            })
        }).then((response) => response.json()
        ).then((res) => {    
            console.log('setnotlist successful');
        });
    e.preventDefault();
    }
    handledistance(event){
        const newdistance = event.target.value;
        this.state.distance.setState(newdistance)
    }
    handlerating(event){
        const newrating = event.target.value;
        this.state.rating.setState(newrating)
    }
    handlemin(event){
        const newmin = event.target.value;
        this.state.minprice.setState(newmin)
    }
    handlemax(event){
        const newmax = event.target.value;
        this.state.maxprice.setState(newmax)
    }
    handleopen(event){
        const newopen = event.target.value;
        this.state.open.setState(newopen)
    }
    handleinlist(event){
        const newinlist = event.target.value;
        this.state.inlist.setState(newinlist)
    }
    handlenotinlist(event){
        const newnotinlist = event.target.value;
        this.state.notinlist.setState(newnotinlist)
    }

    handlechangein(SelectChangeEvent){
        
        this.state.inlist.setState(SelectChangeEvent.target.value)
    }


    handlechangeout(SelectChangeEvent){
        this.state.notinlist.setState(SelectChangeEvent.target.value)
    }

    render(){
        return(
            <div className='settings'>
                <h1>
                    Settings
                </h1>
                <div>
                    Select Default Filters:&nbsp;&nbsp;
                <a onClick={this.HandleSave}>
                Save
                </a>
                </div>
                <div className = 'distance'>
                    Select Default Distance: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Enter in Miles..."
                    onChange = {this.handledistance}
                    value = {this.state.distance}
                    />
                </div>
                <div className = 'open'>
                    Only show places that are open? 
                    <input type="radio" value={this.state.open} name="gender"/> Yes
                    <input type="radio" value={this.state.open} name="gender"/> No
                </div>
                <div className = 'rating'>
                    Select Default Rating Filter: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "1-5"
                    onChange = {this.handlerating}
                    value = {this.state.rating}
                    />
                </div>
                <div className = 'price'>
                    Select Default Price Range: 
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Min..."
                    onChange = {this.handlemin}
                    value = {this.state.minprice}
                    />
                    &nbsp;
                    <TextField
                    type = "number"
                    size = "small"
                    placeholder = "Max..."
                    onChange = {this.handlemax}
                    value = {this.state.maxprice}
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
                    value={this.state.inlist}
                    defaultvalue = {listName}
                    label="InList"
                    onChange={this.handlechangein}
                >
                    {
                        this.state.listNames.map(listName) => (
                            <MenuItem
                            value = {listName}
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
                    value={this.state.notinlist}
                    defaultvalue = {this.state.notinlist}
                    label="InList"
                    onChange={this.handlechangeout}
                >
                    {
                        this.state.listNames.map(listName) => (
                            <MenuItem
                            value = {this.state.notinlist}
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

}






  export default Settings;

