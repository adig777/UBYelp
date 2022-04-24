import React from 'react';
import './Business.css';

class Business extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listNames: {},
            modal: false
        }
        //Set in_list and not_list's dropdown menu values to 'names'
        fetch('http://localhost:3001/listnames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id': this.props.business.account_id
            })
        }).then((response) => response.json()
        ).then((names) => {
            //Format: {'list_name': 'list_id', ...}
            this.setState({ listNames: names });
        });
        this.addToList = this.addToList.bind(this);
        //this.openAddToListModal = this.openAddToListModal.bind(this);
    }
    


    openModal() {
        //this.setState({ modal: true });
        document.getElementById("addModal").style.display = 'block';
    }

    closeModal() {
        //this.setState({ modal: true });
        document.getElementById("addModal").style.display = 'none';
    }

    renderModalOptions() {
        return Object.keys(this.state.listNames).map(name => {
            return (
                <option value={this.state.listNames[name]}>{name}</option>
            );
        });
    }

    submitModal() {

    }

    addToList() {
        console.log(this.state.listNames);
    }

    // Renders the individual businesses returned in the search results
    render() {
        return (
            <div className="Business">
                <div className="image-container">
                    <a href={this.props.business.url} target="_blank">
                        <img src={this.props.business.image_url} alt='' width="280" height="280" />
                    </a>
                </div>
                <a href={this.props.business.url} target="_blank">
                    <h2>{this.props.business.name}</h2>
                </a>
                <div className="Business-information">
                    <div className="Business-address">
                        <p>{this.props.business.location.address1}</p>
                        <p>{this.props.business.location.city}</p>
                        <p>{`${this.props.business.location.state} ${this.props.business.location.zip_code}`}</p>
                    </div>
                    <div className="Business-reviews">
                        <h3>{this.props.business.categories[0].title}</h3>
                        <h3 className="rating">{`${this.props.business.rating} stars`}</h3>
                        <p>{`${this.props.business.review_count} reviews`}</p>
                    </div>
                </div>
                <div id="addModal" class="modal">
                    <div class="modal-content">
                        <span class="close" onClick={this.closeModal}>&times;</span>
                        <h2>Add to list: {this.props.business.name + " " + this.props.business.review_count}</h2>
                        <form>
                            <select id="listMenu">
                                {this.renderModalOptions()}
                            </select>
                        </form>
                        <button onClick={this.submitModal}>Add</button>
                    </div>
                </div>
                <button onClick={this.openModal}>Add to list</button>
            </div>
        );
    }
}

export default Business;