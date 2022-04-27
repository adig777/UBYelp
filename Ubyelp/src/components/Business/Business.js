import React from 'react';
import './Business.css';

class Business extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listNames: {},
            key: this.props.key
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
    


    openModal(business) {
        document.getElementById("modal" + business.id).style.display = 'block';
        document.getElementById("modelHeader" + business.id).innerHTML = 'Adding ' + business.name + ' on ' + business.location.address1 + ' to list';//<i>' + listMenu.options[listMenu.selectedIndex].text + '</i>';
        //document.getElementById("successMessage" + business.id).innerHTML = business.name + ' on ' + business.location.address1 + ' added to ' + listMenu.options[listMenu.selectedIndex].text + '!'
    }

    closeModal(key) {
        document.getElementById("modal"+key).style.display = 'none';
    }

    closeSuccessModal(key) {
        document.getElementById("successModal" + key).style.display = 'none';
    }

    renderModalOptions() {
        return Object.keys(this.state.listNames).map(name => {
            return (
                <option value={this.state.listNames[name]}>{name}</option>
            );
        });
    }

    addToList(business) {
        let listMenu = document.getElementById('listMenu' + business.id);
        if (listMenu.value !== '') {
            fetch('http://localhost:3001/addlistitem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: JSON.stringify({
                    'account_id': business.account_id,
                    'list_id': listMenu.value,
                    'link': encodeURIComponent(business.url),
                    'name': business.name,
                    'desc': document.getElementById("desc" + business.id).value,
                    'rating': document.querySelector('input[name="rating"]:checked').value
                })
            }).then(async (response) => {
                let message = await response.text();
                //Clear modal inputs
                this.closeModal(this.props.business.id);

                document.getElementById("successModal" + this.props.business.id).style.display = 'block';
                if (message === '') {
                    //Open success modal
                    document.getElementById("modalMessage" + this.props.business.id).innerHTML = 'Added ' + business.name + ' on ' + business.location.address1 + ' to ' + listMenu.options[listMenu.selectedIndex].text + '!';
                } else {
                    //Open modal with error message
                    document.getElementById("modalMessage" + this.props.business.id).innerHTML = 'Error: '+message;
                }
                
            });
        }
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
                <button onClick={() => this.openModal(this.props.business)}>Add to list</button>

                <div id={"modal"+this.props.business.id} className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() =>this.closeModal(this.props.business.id)}>&times;</span>
                        <h2 id={"modelHeader" + this.props.business.id}></h2>
                        <select id={"listMenu" + this.props.business.id}>
                            {this.renderModalOptions()}
                            <option value="">Select list...</option>
                        </select>
                        <input type="hidden" id={"listId" + this.props.business.id} />
                        <h3>Description</h3>
                        <textarea id={"desc" + this.props.business.id} cols="60" rows="3" />
                        <h3>Rating for list</h3>
                        <div className="rating">
                            <input type="radio" name="rating" value="5" id="5"/><label for="5">☆</label>
                            <input type="radio" name="rating" value="4" id="4"/><label for="4">☆</label>
                            <input type="radio" name="rating" value="3" id="3"/><label for="3">☆</label>
                            <input type="radio" name="rating" value="2" id="2"/><label for="2">☆</label>
                            <input type="radio" name="rating" value="1" id="1" /><label for="1">☆</label>
                        </div>
                        <button id={"submit" + this.props.business.id} onClick={() => this.addToList(this.props.business)}>Add!</button>
                    </div>
                </div>

                <div id={"successModal" + this.props.business.id} className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => this.closeSuccessModal(this.props.business.id)}>&times;</span>
                        <h2 id={"modalMessage" + this.props.business.id}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Business;