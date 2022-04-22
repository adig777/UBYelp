import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            term:'',
            location:'',
            sortBy:'best_match',
            price: 2,
            open_now: true,
            limit: 20,
            radius: 30000
        };

        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleLocationChange = this.handleLocationChange.bind(this);
        this.handleLimitChange = this.handleLimitChange.bind(this);
        this.handleRadiusChange = this.handleRadiusChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.sortByOptions = {
            'Best Match': 'best_match',
            'Highest Rated': 'rating',
            'Most Reviewed': 'review_count'
        };

        this.filterByPrices = {
            '$': 1,
            '$$': 2,
            '$$$': 3,
            '$$$$': 4
        };

        this.filterByOpenNows = {
           'Open': true,
           'Closed': false
        };



    }

    // Determines which sort method to highlight
    getSortByClass(sortByOption) {
        if(this.state.sortBy === sortByOption) {
            return 'active';
        }
        return '';
    }



    getFilterByPriceClass(filterByPrice){
        if(this.state.price === filterByPrice) {
            return 'active';
        }
        return '';

    }



    getFilterByOpenNowClass(filterByOpenNow){
        if(this.state.open_now === filterByOpenNow) {
            return 'active';
        }
        return '';

    }

    // Determines which sort method to use
    handleSortByChange(sortByOption) {
        this.setState({sortBy: sortByOption})
    }


     // Determines which price range we choose
     handleFilterByPriceChange(filterByPrice) {
        this.setState({price: filterByPrice})
    }

    // Determines open or closed
    handleFilterByOpenNowChange(filterByOpenNow) {
        this.setState({open_now: filterByOpenNow})
    }





    // Updates food/product input given by user
    handleTermChange(event) {
        this.setState({term: event.target.value});
    }

    // Updates location input given by user
    handleLocationChange(event) {
        this.setState({location: event.target.value});
    }

    // Updates limit input given by user
    handleLimitChange(event) {
        this.setState({limit: event.target.value});
    }

     // Updates radius input given by user
     handleRadiusChange(event) {
        this.setState({radius: event.target.value});
    }

    


    // Queries Yelp for food/product
    handleSearch(event) {
        this.props.searchYelp(this.state.term, this.state.location, this.state.sortBy, this.state.price, this.state.open_now, this.state.limit, this.state.radius);
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


 // Highlights the selected price range
 renderFilterByPrice() {
    return Object.keys(this.filterByPrices).map(filterByPrice => {
        let filterByPriceValue = this.filterByPrices[filterByPrice];
        return (
                <li className={this.getFilterByPriceClass(filterByPriceValue)}
                    key={filterByPriceValue}
                    onClick={this. handleFilterByPriceChange.bind(this,filterByPriceValue)}>
                {filterByPrice}
                </li>
                );  
    });
}



 // Highlights open or closed
 renderFilterByOpenNow() {
    return Object.keys(this.filterByOpenNows).map(filterByOpenNow => {
        let filterByOpenNowValue = this.filterByOpenNows[filterByOpenNow];
        return (
                <li className={this.getFilterByOpenNowClass(filterByOpenNowValue)}
                    key={filterByOpenNowValue}
                    onClick={this. handleFilterByOpenNowChange.bind(this,filterByOpenNowValue)}>
                {filterByOpenNow}
                </li>
                );  
    });
}

    // Renders two input boxes. One for business and the other for location. 
    render() {
        return (
            <div className="SearchBar">


                <div className="SearchBar-sort-options">
                    <ul>
                        {this.renderSortByOptions()} 
                    </ul>
                </div>

                <div className="SearchBar-filter-prices">
                    <ul>
                        {this.renderFilterByPrice()} 
                    </ul>
                </div>



                <div className="SearchBar-filter-openNow">          
                    <ul>
                        {this.renderFilterByOpenNow()} 
                    </ul>
                </div>



                <div className="SearchBar-fields">
                    
                    <input placeholder="Enter Keyword. e.g. burgers" onChange={this.handleTermChange} />
                    <input placeholder="Enter Location. e.g. San Jose" onChange={this.handleLocationChange} />           
                    <input placeholder="Enter Number of Results. e.g. 20" onChange={this.handleLimitChange} />
                    <input placeholder="Enter Radius in Meters. e.g. 30000" onChange={this.handleRadiusChange} />

                </div>



                 <div className="SearchBar-submit">
                    <a onClick={this.handleSearch}>Search</a>
                </div>
            </div>    
        );

    }
}

export default SearchBar;
