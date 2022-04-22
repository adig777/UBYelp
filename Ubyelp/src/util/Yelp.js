// Credential provided by Yelp to use their API
const apiKey = '8zjWvQYEUrwtx7rXyqaZbjQ7vuagl3gpNePnEG1NRXmakPtgtzsFluYnTpDt-4vQDQdrdYhfwXmM2BsiXxA-ffTU7jVTtBok8cwjaatAZ8oGrHZ8IBsWWY7ayWXCYHYx';

// Yelp module that stores functionality to interact with Yelp API. Retrieves search results

var x = new XMLHttpRequest();
x.open('GET', 'https://cors-anywhere.herokuapp.com/https://example.com');
x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
x.onload = function() {
    alert(x.responseText);
};
x.send();


const Yelp = {
    search (term, location, sortBy, price, open_now, limit, radius) {
        return fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}&price=${price}&open_now=${open_now}&limit=${limit}&radius=${radius}`,
                    {
                        headers: {
                            Authorization: `Bearer ${apiKey}`
                        }
                    }).then(response => {         
                        return response.json();

                    }).then(jsonResponse => {
                        if(jsonResponse.businesses) {
                            return jsonResponse.businesses.map(business => ({
                                id: business.id,
                                imageSrc: business.image_url,
                                name: business.name,
                                address: business.location.adress1,
                                city: business.location.city,
                                state: business.location.state,
                                zipCode: business.location.zip_code,
                                category: business.categories[0].title,
                                rating: business.rating,
                                reviewCount: business.review_count,
                                price: business.price,
                                phone:business.phone


                            }));
                        }
                    });
    }
};

export default Yelp;
