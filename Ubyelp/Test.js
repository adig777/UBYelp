/* Test criteria
 * -Connect to SQL COMPLETED
 * -Successful Yelp API query COMPLETED
 * -Successful front-end development (print Hello World or whatever)
 */ 

var mysql = require('mysql');
const yelp = require('yelp-fusion'); //Source: https://github.com/tonybadguy/yelp-fusion
const yelp_client = yelp.client('jw1QTKNWV6TdHa85nyk7ZCqS2IMQYyu0RVWbED6-3ha2r4B1AEZ_G1yX5f93JDaCR798BScRnZ0SGfyheSzkUDA-wA_DxuDfWMgcp7qMLEF56nTMkiZZw_IcfBgsYnYx');

yelp_client.search({ //Will take a bit to load
    term: 'fast food',
    location: 'san jose, ca',
}).then(response => {
    for (var i = 0; i < 5; i++) {
        console.log(response.jsonBody.businesses[i].name);
    }
    console.log();
}).catch(e => {
    console.log(e);
});

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'UBYelp',
    password: 'cs160UBY3!p',
    database: 'ubyelp'
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

var queryString = 'SELECT actor_id, first_name FROM sakila.actor;'; //This is just a test and isn't even using our database/schema 
connection.query(queryString, function (err, rows, fields) {
    if (err) throw err;

    for (var i = 0; i < 5; i++) {
        console.log('Item: ', rows[i].actor_id, ' ', rows[i].first_name);
    }
    console.log();
});

connection.end();
