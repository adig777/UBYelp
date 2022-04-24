import React, { useState } from 'react';
import './SearchBar.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function SearchBar() {
    const { state } = useLocation();
    const { account_id } = state;
    const navigate = useNavigate();

    var thisState = {
        id: account_id,
        term:'',
        location:'',
        sortBy:'best_match',
        price: 2,
        open_now: true,
        radius: 30000
    };

    const sortByOptions = {
        'Best Match': 'best_match',
        'Highest Rated': 'rating',
        'Most Reviewed': 'review_count'
    };

    const filterByPrices = {
        '$': 1,
        '$$': 2,
        '$$$': 3,
        '$$$$': 4
    };

    const filterByOpenNows = {
        'Open Now': 1,
        'Hours don\'t matter': 0    //Needs a better name
    };


    //Initialize state
    const [id, unused] = useState(account_id);
    const [term, setTerm] = useState('');
    const [location, setLocation] = useState('');
    const [sortBy, setSortBy] = useState('best_match');
    const [radius, setRadius] = useState(30000);
    const [rating, setRating] = useState('-1');
    const [price, setPrice] = useState(2);
    const [open_now, setOpenNow] = useState(1);
    const [in_list, setInList] = useState('');
    const [not_list, setNotList] = useState('');
    fetch('http://localhost:3001/defaultfilters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({
            'id': id
        })
    }).then((response) => response.json()
    ).then((filters) => {
        setRadius(filters.distance);
        setRating(filters.rating);
        setPrice(filters.price);
        setOpenNow(filters.open);
        setInList(filters.in_list);
        setNotList(filters.not_list);
    });


    // Determines which sort method to highlight
    function getSortByClass(sortByOption) {
        if(sortBy === sortByOption) {
            return 'active';
        }
        return '';
    }



    function getFilterByPriceClass(filterByPrice){
        if (price === filterByPrice) {
            return 'active';
        }
        return '';

    }



    function getFilterByOpenNowClass(filterByOpenNow){
        if (open_now === filterByOpenNow) {
            return 'active';
        }
        return '';

    }

    // Determines which sort method to use
    function handleSortByChange(sortByOption) {
        setSortBy(sortByOption.target.value);
    }


     // Determines which price range we choose
    function handleFilterByPriceChange(filterByPrice) {;
        setPrice(filterByPrice);
    }

    // Determines open or closed
    function handleFilterByOpenNowChange(filterByOpenNow) {
        setOpenNow(filterByOpenNow.target.value);
    }





    // Updates food/product input given by user
    function handleTermChange(event) {
        setTerm(event.target.value);
    }

    // Updates location input given by user
    function handleLocationChange(event) {
        setLocation(event.target.value);
    }

     // Updates radius input given by user
    function handleRadiusChange(event) {
        setRadius(event.target.value);
    }

    


    // Queries Yelp for food/product
    function handleSearch(event) {
        //this.props.searchYelp(state.term, state.location, state.sortBy, state.price, state.open_now, state.radius);
        fetch('http://localhost:3001/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                //Temporary variables used 
                //Alternative option: JSON.stringify(this.filters)
                id: id,
                keywords: term,
                location: location,
                sort_by: sortBy,
                radius: radius,
                rating: rating,
                price: price,
                open: open_now,
                in_list: in_list,
                not_list: not_list
            })
        }).then((response) => response.json()
        ).then((result) => {
            //Send to account_id and results BusinessList
            navigate('/results', { 'state': { 'account_id': thisState.id, 'searchResults': result } });
        });
        event.preventDefault();
    }

    // Highlights the selected sort-by method
    function renderSortByOptions() {
        return Object.keys(sortByOptions).map(sortByOption => {
            let sortByOptionValue = sortByOptions[sortByOption];
            return (
                    <li className={getSortByClass(sortByOptionValue)}
                        key={sortByOptionValue}
                        onClick={handleSortByChange.bind(sortByOptionValue)}>
                    {sortByOption}
                    </li>
                    );  
        });
    }


    // Highlights the selected price range
    function renderFilterByPrice() {
        return Object.keys(filterByPrices).map(filterByPrice => {
            let filterByPriceValue = filterByPrices[filterByPrice];
            return (
                    <li className={getFilterByPriceClass(filterByPriceValue)}
                        key={filterByPriceValue}
                        onClick={()=>handleFilterByPriceChange(filterByPriceValue)}>
                    {filterByPrice}
                    </li>
                    );  
        });
    }



    // Highlights open or closed
    function renderFilterByOpenNow() {
        return Object.keys(filterByOpenNows).map(filterByOpenNow => {
            let filterByOpenNowValue = filterByOpenNows[filterByOpenNow];
            return (
                    <li className={getFilterByOpenNowClass(filterByOpenNowValue)}
                        key={filterByOpenNowValue}
                        onClick={handleFilterByOpenNowChange.bind(filterByOpenNowValue)}>
                    {filterByOpenNow}
                    </li>
                    );  
        });
    }

    // Renders two input boxes. One for business and the other for location. 
    return (
        <div className="SearchBar">


            <div className="SearchBar-sort-options">
                <ul>
                    {renderSortByOptions()} 
                </ul>
            </div>

            <div className="SearchBar-filter-prices">
                <ul>
                    {renderFilterByPrice()}
                </ul>
            </div>



            <div className="SearchBar-filter-openNow">          
                <ul>
                    {renderFilterByOpenNow()} 
                </ul>
            </div>



            <div className="SearchBar-fields">
                    
                <input placeholder="Enter Keyword. e.g. burgers" onChange={handleTermChange} />
                <input placeholder="Enter Location. e.g. San Jose" onChange={handleLocationChange} />
                <input placeholder="Enter Radius in Meters. e.g. 30000" onChange={handleRadiusChange} />

            </div>



                <div className="SearchBar-submit">
                <a onClick={handleSearch}>Search</a>
            </div>
        </div>    
    );
}
