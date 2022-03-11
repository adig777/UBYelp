/* Test criteria
 * -Connect to SQL
 * -Successful Yelp API query
 * -Successful front-end development (print Hello World or whatever)
 */ 

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "UBYelp",
    pass: "cs160UBY3!p",
    database: "ubyelp",
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});
