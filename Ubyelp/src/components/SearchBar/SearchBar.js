import React from 'react';
import './SearchBar.css';
import { useLocation } from "react-router-dom";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term:'',
            location:'',
            price:'',
            sortBy:'best_match'
        };

        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.sortByOptions = {
            'Best Match': 'best_match',
            'Highest Rated': 'rating',
            'Most Reviewed': 'review_count',
            'Open': 'open'
        };
    }

    // Determines which sort method to highlight
    getSortByClass(sortByOption) {
        if(this.state.sortBy === sortByOption) {
            return 'active';
        }
        return '';
    }

    // Determines which sort method to use
    handleSortByChange(sortByOption) {
        this.setState({sortBy: sortByOption})
    }

    // Updates food/product input given by user
    handleTermChange(event) {
        this.setState({term: event.target.value});
    }

    // Updates location input given by user
    handleLocationChange(event) {
        this.setState({location: event.target.value});
    }


    // Updates Price input given by user
    handlePriceChange(event) {
        this.setState({price: event.target.value});
    }



    // Queries Yelp for food/product
    handleSearch(event) {
        this.props.searchYelp(this.state.term, this.state.location, this.state.price, this.state.sortBy);
        event.preventDefault();
    }

    // Highlights the selected sort-by method
    renderSortByOptions() {
        return Object.keys(this.sortByOptions).map(sortByOption => {
            let sortByOptionValue = this.sortByOptions[sortByOption];
            return (
                    <li className={this.getSortByClass(sortByOptionValue)}
                        key={sortByOptionValue}
                        onClick={this.handleSortByChange.bind(this,sortByOptionValue)}>
                    {sortByOption}
                    </li>
                    );  
        });
    }

    // Renders three input boxes: keyword, location, and price
    render() {
        return (
            <div className="SearchBar">
                <div className="SearchBar-sort-options">
                    <ul>
                        {this.renderSortByOptions()}
                    </ul>
                </div>
                <div className="SearchBar-fields">
                    <input placeholder="Enter Keyword e.g. burgers" onChange={this.handleTermChange} />
                    <input placeholder="Enter Location e.g. San Jose" onChange={this.handleLocationChange} />
                    <input placeholder="Enter Price e.g. $/$$/$$$" onChange={this.handlePriceChange} /> 

                </div>
                 <div className="SearchBar-submit">
                    <a onClick={this.handleSearch}>Search</a>
                </div>
            </div>    
        );

    }
}

export default SearchBar;