import React from "react";
import ThemeProvider from "./Themes/ThemeProvider";
import ThemeSetter from "./ThemeSetter";
import './Settings.css'

class Settings extends React.Component{
    constructor(props) {
        super(props);
        this.pageTitle = "Settings";
        this.state = {
            filters: {
                location: false,
                rating: false,
                review_count: false,
                open: false,
                price: false
            }
        }   
}
Handlecheckbox = event => {
    let state = this.state;
    state.filters[event.target.value] = event.target.checked;
    this.setState(state);
    }

    render(){
        return(
            <div className='settings'>
                <h1>
                    Settings
                </h1>
                <div>
                    Select Default Filters:
                </div>
                <div>
                    Closest to me <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "location"/>
                </div>
                <div>
                    Highest Rating <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "rating"/>
                </div>
                <div>
                    Number of Reviews <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "review_count"/>
                </div>
                <div>
                    Currently Open <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "open"/>
                </div>
                <div>
                    Cheapest first <input onChange={this.Handlecheckbox} type = "checkbox" name = "filters" value = "price"/>
                </div>
                <ThemeProvider>
                    <div className="themeSwitch">
                    Light/Dark Theme:
                    <ThemeSetter/>
                    </div>
                </ThemeProvider>
            </div>
        );
    }

  }
  export default Settings;
