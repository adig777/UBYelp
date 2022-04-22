import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term:'',
            location:'',
            sortBy:'best_match'
        };

        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.sortByOptions = {
            'Best Match': 'best_match',
            'Highest Rated': 'rating',
            'Most Reviewed': 'review_count'
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

    // Queries Yelp for food/product
    handleSearch(event) {
        this.props.searchYelp(this.state.term, this.state.location, this.state.sortBy);
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

    // Renders two input boxes. One for business and the other for location
    render() {
        return (
            <div className="SearchBar">
                <div className="SearchBar-sort-options">
                    <ul>
                        {this.renderSortByOptions()}
                    </ul>
                </div>
                <div className="SearchBar-fields">
                    <input placeholder="Enter Keyword. e.g. burgers" onChange={this.handleTermChange} />
                    <input placeholder="Enter Location. e.g. San Jose" onChange={this.handleLocationChange} />
                </div>


                <div className="SearchBar-filter">
                    <div className="buttons has-addons">
                       <button className="button">$</button>
                       <button className="button">$$</button>
                       <button className="button">$$$</button>
                    </div>

                    <div className="buttons has-addons">
                       <button className="button">Open Now</button>
                    </div>

                </div>

                



                 <div className="SearchBar-submit">
                    <a onClick={this.handleSearch}>Search</a>
                </div>
            </div>    
        );

    }
}

export default SearchBar;