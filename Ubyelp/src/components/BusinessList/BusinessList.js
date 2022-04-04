import React from 'react';
import './BusinessList.css';
import Business from '../Business/Business';

class BusinessList extends React.Component {
    // Renders the collection of businesses returned in the search results
    render() {
        return (
            <div className="BusinessList">
                {
                    this.props.businesses.map(business => {
                        return <Business business={business} key={business.id}/>
                    })
                }
            </div>
        );
    }
}

export default BusinessList;