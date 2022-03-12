/* Test criteria
 * -Connect to SQL COMPLETED
 * -Successful Yelp API query
 * -Successful front-end development (print Hello World or whatever)
 */ 

var mysql = require('mysql');
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

    for (var i in rows) {
        console.log('Item: ', rows[i].actor_id, ' ', rows[i].first_name);
    }
});