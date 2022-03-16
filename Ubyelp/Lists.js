/* List format
list = {
    title: "",
    desc: "",
    restaurants: [],
    id: #
}
*/
/* List Item format
restuarant = {
    title: "",
    desc: "",
    rating: 1-5,
    link: ""
    id: #
}
*/
const account_list_relation = 'has_lists';
const list_table = 'list';

const mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'UBYelp',
    password: 'cs160UBY3!p',
    database: 'ubyelp'
});

//Connect to database (helper method)
function connect() {
    connection.connect((err) => {
        if (err) throw err;
    });
}

//Get all lists from Database
function getLists() {
    var lists = [];

}

//Create List
function createList(account_id, name, desc) {
    //Check if name exists
    if (name == '') throw 'List name cannot be empty!'
    connect();
    var query = 'SELECT name FROM ' + list_table + ' JOIN ' + account_list_relation + ' USING(list_id);';
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;

        for (var i = 0; i < rows.length; i++) {
            if (name == rows[i].name) throw 'Name already exists!';
        }
    });

    //Generate list id
    var list_id;
    query = 'SELECT MAX(list_id) FROM ' + list_table;
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;

        list_id = rows[0]['MAX(list_id)'];
        if (typeof list_id != 'number') list_id = 0;
    });
    console.log(list_id);

    //Create list
    query = 'INSERT INTO ' + list_table + ' (list_id, name, desc) VALUES (' + list_id + ', ' + name + ', ' +desc + ');'
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;
    });

    //Create account-list relation
    query = 'INSERT INTO ' + account_list_relation + ' (account_id, list_id) VALUES (' + account_id + ', '+ list_id +');'
    connection.query(query, function (err, rows, fields) {
        if (err) throw err;
    });

}

//Remove list

//Edit title of List

//Edit description of list

//Add list item (Requires: title, link)

//Remove list item from list

//Add/Edit description to list item

//Rate list item


/*Helper functions*/

createList(1, 'test', 'desc');
