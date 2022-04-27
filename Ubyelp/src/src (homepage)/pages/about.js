import React from "react";
import './about.css';
//import Form from "react-bootstrap/Form";
  
const About = () => {
  return (
    <div>
     
      <h1>
       About:
      </h1>

      <h2>
          <p>
          As Yelp is the biggest platform that provides business rating service among the nation, it allows users to quickly find the high-rating stores such as restaurants via the functionality of searching. However, those low-rating and new opening businesses have little chance to be listed at the top of the search page due to Yelp’s “unfair” manipulations such as “selling advertising” to some business, who will then be on the top of the search page. As a result, customers would have a limited choice of restaurants while depending on the search result of Yelp. As customers, we  want to have the opportunity to try different places, not just those top-rated restaurants, through a better filter functionality.   
          </p>
          <p>
          Therefore, this application named UBYelp is the best solution to meet customers’ needs and fulfill the gap. With this application, users can still have some standard functionality as Yelp does such as searching for certain businesses based on the categories, locations that are currently open, etc. The highlight of the application is that users are able to create their own list of restaurants which are used to filter out search results. In this way, the related restaurants falling into the search categories can be shown on the search page regardless of the business’ current rating. What’s more, users can have the ability to customize their list such as adding new restaurants, deleting a restaurant, leaving personal notes for certain items of a restaurant, etc. 
          </p>
      </h2>
 
    </div>
  );
};
  
export default About;