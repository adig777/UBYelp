import React from "react";
import ThemeSetter from "./ThemeSetter";
import "./Settings.css";
import ThemeProvider from "./Themes/ThemeProvider";


class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.pageTitle = "Settings";
        this.state = {
            filters: {
                location: false,
                rating: false,
                open: false,
                1: false,
                2: false,
                3: false,
                4: false
            }
        }   
}
Handlecheckbox = event => {
    let state = this.state;
    state.filters[event.target.value] = event.target.checked;
    this.setState(state);
    }
HandleSave = event => {

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
                <div>
                    Closest to me <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "location"/>
                </div>
                <div>
                    Highest Rating <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "rating"/>
                </div>
                <div>
                    Currently Open <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "open"/>
                </div>
                <div>
                  Price
                </div>
                <div>
                    $ <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "1"/>
                    &nbsp;&nbsp;$$ <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "2"/>
                    &nbsp;&nbsp;$$$ <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "3"/>
                    &nbsp;&nbsp;$$$$ <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "4"/>
                </div>
                <div className="ListFilter">
                List to filter: 
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
