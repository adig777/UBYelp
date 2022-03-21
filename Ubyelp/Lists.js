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
const list_item_relation = 'contains_item';
const list_table = 'list';
const list_item_table = 'list_item';

const mysql = require('mysql');
var connection = mysql.createConnection({     //Concurrency issue
    host: 'localhost',
    user: 'UBYelp',
    password: 'cs160UBY3!p',
    database: 'ubyelp'
});

//Create List (Requires: name)
async function createList(account_id, name, desc) {
    //Check if name exists
    if (name == '') throw 'List name cannot be empty!'
    await queryVerifyName(name);

    //Generate list id
    var list_id = await queryGenerateListId();
    var query = 'INSERT INTO ' + list_table + ' (`list_id`, `name`, `desc`) VALUES (' + list_id + ', \'' + name + '\', \'' + desc + '\');';

    //Create list
    await quickQuery(query);

    //Create account-list relation
    query = 'INSERT INTO ' + account_list_relation + ' (`account_id`, `list_id`) VALUES (' + account_id + ', ' + list_id + ');';
    await quickQuery(query);

    console.log('List ' + list_id + ' created');
}

//Remove list
async function removeList(account_id, list_id) {
    //Remove list
    await queryAccountListAccess(account_id, list_id);

    var query = 'DELETE FROM ' + list_table + ' WHERE `list_id`=' + list_id;
    await quickQuery(query);

    //Remove account-list relation
    query = 'DELETE FROM ' + account_list_relation + ' WHERE `account_id`=' + account_id + ' AND `list_id`=' + list_id;
    await quickQuery(query);

    console.log('List ' + list_id + ' removed');
}

//Edit title of List
async function editListName(account_id, list_id, newTitle) {
    await queryAccountListAccess(account_id, list_id);

    var query = 'UPDATE ' + list_table + ' SET `name`=\'' + newTitle + '\' WHERE `list_id`=' + list_id;
    await quickQuery(query);
    console.log('List name changed');
}

//Edit description of list
async function editListDescription(account_id, list_id, newDesc) {
    await queryAccountListAccess(account_id, list_id);

    const query = 'UPDATE ' + list_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_id`=' + list_id;
    await quickQuery(query);
    console.log('List description changed');
}

//Add list item (Requires: link)
async function addListItem(account_id, list_id, name, link, desc, rating) {
    if (link == '') throw 'Link not provided';
    await queryAccountListAccess(account_id, list_id);

    //Generate list item id
    let list_item_id = await queryGenerateListItemId();

    //Create list item-list relation
    var query = 'INSERT INTO ' + list_item_relation + ' (`list_id`, `list_item_id`) VALUES (' + list_id + ', ' + list_item_id + ');';
    await quickQuery(query);

    //Create list item
    query = 'INSERT INTO ' + list_item_table + ' (`list_item_id`, `name`, `desc`, `rating`, `link`) VALUES (' + list_item_id + ', \'' + name + '\', \'' + desc + '\', ' + rating + ', \'' + link + '\');';
    await quickQuery(query);

    console.log('List item added');
}

//Remove list item from list
async function removeListItem(account_id, list_id, list_item_id) {
    await queryAccountListItemAccess(account_id, list_item_id);

    //Remove list_item
    var query = 'DELETE FROM ' + list_item_table + ' WHERE `list_item_id`=' + list_item_id;
    await quickQuery(query);

    //Remove list item-list relation
    query = 'DELETE FROM ' + list_item_relation + ' WHERE `list_id`=' + list_id + ' AND `list_item_id`=' + list_item_id;
    await quickQuery(query);

    console.log('List Item ' + list_item_id + ' removed');
}

//Add/Edit description to list item
async function editItemDescription(account_id, list_item_id, newDesc) {
    await queryAccountListItemAccess(account_id, list_item_id);

    const query = 'UPDATE ' + list_item_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_item_id`=' + list_item_id;
    await quickQuery(query);

    console.log('List item description change');
}

//Rate list item
async function editItemRating(account_id, list_item_id, rating) {
    await queryAccountListItemAccess(account_id, list_item_id);

    const query = 'UPDATE ' + list_item_table + ' SET `rating`=\'' + rating + '\' WHERE `list_item_id`=' + list_item_id;
    await quickQuery(query);

    console.log('List item rating changed');
}

//Change list item name
async function editItemName(account_id, list_item_id, name) {
    await queryAccountListItemAccess(account_id, list_item_id);

    const query = 'UPDATE ' + list_item_table + ' SET `name`=\'' + name + '\' WHERE `list_item_id`=' + list_item_id;
    await quickQuery(query);

    console.log('List item name changed');
}





/*Helper functions*/

//Connect to database (helper method)
function connect() {
    connection.connect((err) => {
        if (err) throw err;
    });
}

function disconnect() {
    //Render page
    connection.end();
}

//Get all lists from Database
async function getLists(account_id, callback) {
    const query = 'SELECT list.name AS \'listname\', list.desc AS \'listdesc\', list_item.name AS \'itemname\', list_item.desc AS \'itemdesc\', list_item.rating AS \'rating\', list_item.link AS \'link\' FROM ' + account_list_relation + ' JOIN ' + list_item_relation + ' USING(list_id) JOIN ' + list_table + ' USING(list_id) JOIN ' + list_item_table + ' USING(list_item_id) WHERE `account_id`=' + account_id;
    connection.query(query, function (err, rows, fields) {
        if (err) callback(err, null);

        list = {};
        for (var i = 0; i < rows.length; i++) {
            let listitem = {
                'name': rows[i].itemname,
                'desc': rows[i].itemdesc,
                'rating': rows[i].rating,
                'link': rows[i].link
            };
            if (!list[rows[i].listname]) {
                list[rows[i].listname] = {
                    'desc': rows[i].listdesc,
                    'items': [listitem]
                }
            } else {
                list[rows[i].listname]['items'].push(listitem);
            }
        }
        callback(null, list);
    });
}






/*Query Promises*/
function queryVerifyName(name) {
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

function queryGenerateListId() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(list_id) FROM ' + list_table;
        connection.query(query, function (err, rows, fields) {
            if (err) reject(err);

            list_id = rows[0]['MAX(list_id)'] + 1;
            if (typeof list_id != 'number') list_id = 0;
            resolve(list_id);
        });
    });
}

function queryGenerateListItemId() {
    return new Promise((resolve, reject) => {
        const query = 'SELECT MAX(list_item_id) FROM ' + list_item_relation;
        connection.query(query, function (err, rows, fields) {
            if (err) reject(err);

            list_item_id = rows[0]['MAX(list_item_id)'] + 1;
            if (typeof list_item_id != 'number') list_item_id = 0;
            resolve(list_item_id);
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

function queryAccountListAccess(account_id, list_id) {
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

function queryAccountListItemAccess(account_id, list_item_id) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT list_item_id FROM ' + account_list_relation + ' JOIN ' + list_item_relation + ' USING(list_id) ' + ' WHERE `account_id`=' + account_id;
        connection.query(query, function (err, rows, fields) {
            if (err) reject(err);

            for (var i = 0; i < rows.length; i++) {
                if (list_item_id == rows[i].list_item_id) resolve();
            }
            reject(new Error('ERROR: Illegal access to list!'));
        });
    });
}

//Testing
async function test() {
    connect();
    await createList(1, 'new', 'desc');
    await editListName(1, 1, 'new name');
    await editListDescription(1, 1, 'new desc');
    await addListItem(1, 1, 'Aple', 'www.yelp.com/asfsdhkgdl', 'local apple store', 4);
    await editItemDescription(1, 1, 'hated apple store');
    await editItemRating(1, 1, 1);
    await editItemName(1, 1, '2nd Apple Store');
    await getLists(1, (err, list) => {
        if (err) throw err;
        else {
            for (var key in list) {
                console.log('List Name: ' + key);
                console.log('\tDesc: ' + list[key]['desc']);
                for (var item in list[key]['items']) {
                    console.log('\tItem: ' + list[key]['items'][item]['name']);
                    console.log('\t\tItem: ' + list[key]['items'][item]['desc']);
                    console.log('\t\tItem: ' + list[key]['items'][item]['link']);
                    console.log('\t\tItem: ' + list[key]['items'][item]['rating']);
                }
            }
        }
    });
    await removeListItem(1, 1, 1);
    await removeList(1, 1);
    
    disconnect();
}

test();