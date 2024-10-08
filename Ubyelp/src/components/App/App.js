import React from 'react';
import './App.css';
import BusinessList from '../BusinessList/BusinessList';
import SearchBar from '../SearchBar/SearchBar';
import Yelp from '../../util/Yelp';

class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      businesses: []
    };
    this.searchYelp = this.searchYelp.bind(this);
  }

  // Queries Yelp for food/product and returns local businesses
  searchYelp(term, location, sortBy, price, open_now, limit, radius) {
    Yelp.search(term, location, sortBy, price, open_now, limit, radius).then(businesses => {
      this.setState({
        businesses: businesses
      });
    });
  }
  
  // Renders the top half and bottom half of the application
  render() {
    return (
      <div className="App">
        <h1>UBYelp</h1>
        <SearchBar searchYelp={this.searchYelp}/>
        <BusinessList businesses={this.state.businesses}/>
      </div>  
    );
  }
}

export default App;
