import React, { useState } from 'react';
import './SearchBar.css';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button"

export default function SearchBar() {
    const { state } = useLocation();
    const { account_id } = state;
    const navigate = useNavigate();

    var thisState = {
        id: account_id,
        term: '',
        location: '',
        sortBy: 'best_match',
        price: 2,
        open_now: true,
        radius: 30000
    };

    const sortByOptions = {
        'Best Match': 'best_match',
        'Distance': 'distance',
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
    const [price, setPrice] = useState('');
    const [open_now, setOpenNow] = useState(1);
    const [in_list, setInList] = useState('');
    const [not_list, setNotList] = useState('');

    const [priceToggle, setPriceToggle] = useState([false, false, false, false]);   //Not a filter
    const [listNames, setListNames] = useState({});
    const [initialized, setInitialized] = useState(false);

    function initialize() {
        if (!initialized) {
            //Get Default Filters
            fetch('http://localhost:3001/defaultfilters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: JSON.stringify({
                    'id': id
                })
            }).then((response) => response.json()
            ).then((filters) => {

                setLocation(filters.address);
                setRadius(filters.distance);
                setRating(filters.rating);
                setPrice(filters.price);
                setOpenNow(filters.open);
                setInList(filters.in_list);
                setNotList(filters.not_list);

                if (filters.address !== '') document.getElementById("location").value = location;
                if (filters.distance !== -1) document.getElementById("radius").value = radius;
                if (filters.rating !== -1) document.getElementById("rating").value = rating;
                if (filters.in_list !== '') document.getElementById("inList").value = in_list
                if (filters.not_list !== '') document.getElementById("notList").value = not_list

                //Get List Names
                fetch('http://localhost:3001/listnames', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: JSON.stringify({
                        'id': id
                    })
                }).then((response) => response.json()
                ).then((names) => {
                    //Format: {'list_name': 'list_id', ...}
                    setListNames(names);
                    setInitialized(true);
                });
            });
        }

    }



    // Determines which sort method to highlight
    function getSortByClass(sortByOption) {
        if (sortBy === sortByOption) {
            return 'active';
        }
        return '';
    }

    function getFilterByPriceClass(filterByPrice) {
        if (priceToggle[filterByPrice - 1] == true) {
            return 'active';
        }
        return '';

    }

    function getFilterByOpenNowClass(filterByOpenNow) {
        if (open_now === filterByOpenNow) {
            return 'active';
        }
        return '';

    }



    // Determines which sort method to use
    function handleSortByChange(sortByOption) {
        setSortBy(sortByOption);
    }

    // Determines which price range we choose
    function handleFilterByPriceChange(filterByPrice) {
        priceToggle[filterByPrice - 1] = !priceToggle[filterByPrice - 1];

        let p = '';
        if (priceToggle[0]) p += '1,';
        if (priceToggle[1]) p += '2,';
        if (priceToggle[2]) p += '3,';
        if (priceToggle[3]) p += '4,';
        if (p !== '') p = p.substring(0, p.length - 1);

        setPrice(p);
    }

    // Determines open or closed
    function handleFilterByOpenNowChange(filterByOpenNow) {
        setOpenNow(filterByOpenNow);
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
        let value = event.target.value;
        if (value > 40000) {
            document.getElementById("radius").value = 40000;
            value = 40000;
        } else if (value < 1) {
            document.getElementById("radius").value = 1;
            value = 1;
        }
        setRadius(value);
    }

    function handleRatingChange(event) {
        let value = event.target.value;
        if (value > 5) {
            document.getElementById("rating").value = 5;
            value = 5;
        } else if (value <= 0) {
            document.getElementById("rating").value = 0.1;
            value = 0.1;
        }
        setRating(event.target.value);
    }

    function handleInListChange(event) {
        setInList(event.target.value);
    }

    function handleNotListChange(event) {
        setNotList(event.target.value);
    }

    // Queries Yelp for food/product
    function handleSearch(event) {
        //this.props.searchYelp(state.term, state.location, state.sortBy, state.price, state.open_now, state.radius);
        document.getElementById("error").innerHTML = '';
        if (term === '') {
            document.getElementById("error").innerHTML = 'Please enter some keywords! ';
        } else if (location === '') {
            document.getElementById("error").innerHTML += 'Please enter a location!';

        } else {
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
                if (Object.keys(result).length === 0) {
                    document.getElementById("error").innerHTML = 'Error in results. Please use use different keywords and verify location is valid.';
                } else {
                    //Send to account_id and results BusinessList
                    navigate('/results', { 'state': { 'account_id': thisState.id, 'searchResults': result } });
                }
            });
        }
        event.preventDefault();
    }



    // Highlights the selected sort-by method
    function renderSortByOptions() {
        return Object.keys(sortByOptions).map(sortByOption => {
            let sortByOptionValue = sortByOptions[sortByOption];
            return (
                <li className={getSortByClass(sortByOptionValue)}
                    key={sortByOptionValue}
                    onClick={() => handleSortByChange(sortByOptionValue)}>
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
                    onClick={() => handleFilterByPriceChange(filterByPriceValue)}>
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
                    onClick={() => handleFilterByOpenNowChange(filterByOpenNowValue)}>
                    {filterByOpenNow}
                </li>
            );
        });
    }

    function renderOptions() {
        return Object.keys(listNames).map(name => {
            return (
                <option>{name}</option>
            );
        });
    }



    // Renders two input boxes. One for business and the other for location. 
    return (
        <div className="SearchBar">
            <div className="NavBar">
                UBYELP
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/search') }}>
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
                <Button onClick={() => { navigate('/settings', { 'state': { 'account_id': account_id } })}}>
                    Settings
                </Button>
            </div>

            {initialize()}
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
                <div>
                    <p>Keywords</p>
                    <input placeholder="Enter Keyword. e.g. burgers" onChange={handleTermChange} />
                </div>
                <div>
                    <p>Location</p>
                    <input id="location" placeholder="Enter Location. e.g. San Jose" onChange={handleLocationChange} />
                </div>
                <div>
                    <p>Radius (meters)</p>
                    <input id="radius" type="number" min="1" max="40000" placeholder="Enter Radius in Meters. e.g. 30000" onChange={handleRadiusChange} />
                </div>
            </div>

            <div className="SearchBar-fields">
                <div>
                    <p>Rating</p>
                    <input id="rating" type="number" min="0" max="5" step="0.1" placeholder="Minimum rating. e.g. 3.5" onChange={handleRatingChange} />
                </div>
                <div>
                    <p>List of restaurants to only include in results</p>
                    <select id="inList" className="SearchBar-dropdown" onChange={handleInListChange}>
                        <option value="">Select list to include from...</option>
                        {renderOptions()}
                    </select>
                </div>
                <div>
                    <p>List of restaurants to not include in results</p>
                    <select id="notList" className="SearchBar-dropdown" onChange={handleNotListChange}>
                        <option value="">Select list to not include...</option>
                        {renderOptions()}
                    </select>
                </div>
            </div>
            <div>
                <p id="error" />
            </div>
            <div className="SearchBar-submit">
                <a onClick={handleSearch}>Search</a>
            </div>
            
        </div>
    );
}
