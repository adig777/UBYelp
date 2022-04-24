import React from 'react';
import './BusinessList.css';
import Business from '../Business/Business';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function BusinessList() {
    const { state } = useLocation();
    const { account_id, searchResults } = state;
    const navigate = useNavigate();

    function renderBusinesses() {
        return Object.keys(searchResults).map(index => {
            searchResults[index]['account_id'] = account_id;
            return (
                <Business business={searchResults[index]} key={searchResults[index].id} />
            );
        });
    }

    // Renders the collection of businesses returned in the search results
    return (
        <div className="BusinessList">
            {
                renderBusinesses()
                //this.props.businesses.map(business => {
                //    return <Business business={business} key={business.id}/>
                //})
            }
        </div>
    );
}

//export default BusinessList;