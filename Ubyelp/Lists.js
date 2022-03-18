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
var connection = mysql.createConnection({     //Concurrency issue
    host: 'localhost',
    user: 'UBYelp',
    password: 'cs160UBY3!p',
    database: 'ubyelp'
});

//Create List
async function createList(account_id, name, desc) {
    //Check if name exists
    if (name == '') throw 'List name cannot be empty!'
    connect();
    await queryVerifyName(name);

    //Generate list id
    var list_id = await queryGetMaxListId();
    var query = 'INSERT INTO ' + list_table + ' (`list_id`, `name`, `desc`) VALUES (' + list_id + ', \'' + name + '\', \'' + desc + '\');'

    //Create list
    await quickQuery(query);

    //Create account-list relation
    query = 'INSERT INTO ' + account_list_relation + ' (`account_id`, `list_id`) VALUES (' + account_id + ', ' + list_id + ');'
    await quickQuery(query);

    disconnect();
    console.log('List ' + list_id + ' created');
}

//Remove list
async function removeList(account_id, list_id) {
    //Remove list
    var query = 'DELETE FROM ' + list_table + ' WHERE `list_id`=' + list_id;
    connect();
    await quickQuery(query);

    //Remove account-list relation
    query = 'DELETE FROM ' + account_list_relation + ' WHERE `account_id`=' + account_id + ' AND `list_id`=' + list_id;
    await quickQuery(query);

    disconnect();
    console.log('List ' + list_id + ' removed');
}

//Edit title of List
async function editListName(account_id, list_id, newTitle) {
    connect();
    await queryAccountAccess(account_id, list_id);

    var query = 'UPDATE ' + list_table + ' SET `name`=\'' + newTitle + '\' WHERE `list_id`=' + list_id;
    await quickQuery(query);
    disconnect();
    console.log('List updated');
}

//Edit description of list
async function editListDescription(account_id, list_id, newDesc) {
    connect();
    await queryAccountAccess(account_id, list_id);

    var query = 'UPDATE ' + list_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_id`=' + list_id;
    await quickQuery(query);
    disconnect();
    console.log('List updated');
}

//Add list item (Requires: title, link)

//Remove list item from list

//Add/Edit description to list item

//Rate list item






/*Helper functions*/

//Connect to database (helper method)
function connect() {
    connection.connect((err) => {
        if (err) throw err;
    });
}

function disconnect() {
    connection.end();
}
//Get all lists from Database
function getLists() {
    var lists = [];

}






/*Query Promises*/
function queryVerifyName(name){
    return new Promise((resolve, reject) => {
        const query = 'SELECT name FROM ' + list_table + ' JOIN ' + account_list_relation + ' USING(list_id);';
        connection.query(query, function (err, rows, fields) {
            if (err) throw err;

            for (var i = 0; i < rows.length; i++) {
                if (name == rows[i].name) reject(new Error('Name already exists!'));
            }
            resolve();
        });
    });
}

function queryGetMaxListId() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(list_id) FROM ' + list_table;
        connection.query(query, function (err, rows, fields) {
            if (err) reject(err);

            list_id = rows[0]['MAX(list_id)'];
            if (typeof list_id != 'number') list_id = 0;
            resolve(list_id);
        });
    });
}

function quickQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, function (err, rows, fields) {
            if (err) reject(err);
            resolve();
        });
    });
}

function queryAccountAccess(account_id, list_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT list_id FROM ' + account_list_relation + ' WHERE `account_id`=' + account_id;
        connection.query(query, function (err, rows, fields) {
            if (err) reject(err);

            for (var i = 0; i < rows.length; i++) {
                if (list_id == rows[i].list_id) resolve();
            }
            reject(new Error('ERROR: Illegal access to list!'));
        });
    });
}

//Testing
//createList(1, 'test', 'desc');
//removeList(1, 0);
//editListName(1, 0, 'new name');
//editListDescription(1, 0, 'new desc');