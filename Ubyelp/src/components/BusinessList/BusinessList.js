import React from 'react';
import './BusinessList.css';
import Button from "@mui/material/Button"
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
        <div>
            <div className="NavBar">
                UBYELP
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => { navigate('/search', { 'state': { 'account_id': account_id } }) }}>
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
                <Button onClick={() => { navigate('/settings', { 'state': { 'account_id': account_id } }) }}>
                    Settings
                </Button>
            </div>
            <div className="BusinessList">
                {
                    renderBusinesses()
                    //this.props.businesses.map(business => {
                    //    return <Business business={business} key={business.id}/>
                    //})
                }
            </div>
        </div>
    );
}

//export default BusinessList;