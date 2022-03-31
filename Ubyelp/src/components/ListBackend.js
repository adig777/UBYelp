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
const mysqlConnection = require("./mysqlConnection");

const account_list_relation = 'has_lists';
const list_item_relation = 'contains_item';
const list_table = 'list';
const list_item_table = 'list_item';

class ListBackend{
    constructor(account_id) {
        this.Connection = new mysqlConnection();
        this.Connection.connect();

        this.account_id = account_id;
        this.createList = this.createList.bind(this);
        this.removeList = this.removeList.bind(this);
        this.editListName = this.editListName.bind(this);
        this.editListDescription = this.editListDescription.bind(this);
        this.addListItem = this.addListItem.bind(this);
        this.removeListItem = this.removeListItem.bind(this);
        this.editItemDescription = this.editItemDescription.bind(this);
        this.editItemRating = this.editItemRating.bind(this);
        this.editItemName = this.editItemName.bind(this);
        this.getLists = this.getLists.bind(this);
        this.disconnect = this.disconnect.bind(this);

        this.#queryVerifyName;
        this.#queryGenerateListId;
        this.#queryGenerateListItemId;
        this.#quickQuery;
        this.#queryAccountListAccess;
        this.#queryAccountListItemAccess;
    }

    //Create List (Requires: name)
    async createList(name, desc) {
        //Check if name exists
        if (name == '') throw 'List name cannot be empty!'
        await this.#queryVerifyName(name);

        //Generate list id
        var list_id = await this.#queryGenerateListId();
        var query = 'INSERT INTO ' + list_table + ' (`list_id`, `name`, `desc`) VALUES (' + list_id + ', \'' + name + '\', \'' + desc + '\');';

        //Create list
        await this.#quickQuery(query);

        //Create account-list relation
        query = 'INSERT INTO ' + account_list_relation + ' (`account_id`, `list_id`) VALUES (' + this.account_id + ', ' + list_id + ');';
        await this.#quickQuery(query);

        console.log('List ' + list_id + ' created');
    }

    //Remove list
    async removeList(list_id) {
        //Remove list
        await this.#queryAccountListAccess(list_id);

        var query = 'DELETE FROM ' + list_table + ' WHERE `list_id`=' + list_id;
        await this.#quickQuery(query);

        //Remove account-list relation
        query = 'DELETE FROM ' + account_list_relation + ' WHERE `account_id`=' + this.account_id + ' AND `list_id`=' + list_id;
        await this.#quickQuery(query);

        console.log('List ' + list_id + ' removed');
    }

    //Edit title of List
    async editListName(list_id, newTitle) {
        await this.#queryAccountListAccess(list_id);

        var query = 'UPDATE ' + list_table + ' SET `name`=\'' + newTitle + '\' WHERE `list_id`=' + list_id;
        await this.#quickQuery(query);
        console.log('List name changed');
    }

    //Edit description of list
    async editListDescription(list_id, newDesc) {
        await this.#queryAccountListAccess(list_id);

        const query = 'UPDATE ' + list_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_id`=' + list_id;
        await this.#quickQuery(query);
        console.log('List description changed');
    }

    //Add list item (Requires: link)
    async addListItem(list_id, name, link, desc, rating) {
        if (link == '') throw 'Link not provided';
        await this.#queryAccountListAccess(list_id);

        //Generate list item id
        let list_item_id = await this.#queryGenerateListItemId();

        //Create list item-list relation
        var query = 'INSERT INTO ' + list_item_relation + ' (`list_id`, `list_item_id`) VALUES (' + list_id + ', ' + list_item_id + ');';
        await this.#quickQuery(query);

        //Create list item
        query = 'INSERT INTO ' + list_item_table + ' (`list_item_id`, `name`, `desc`, `rating`, `link`) VALUES (' + list_item_id + ', \'' + name + '\', \'' + desc + '\', ' + rating + ', \'' + link + '\');';
        await this.#quickQuery(query);

        console.log('List item added');
    }

    //Remove list item from list
    async removeListItem(list_id, list_item_id) {
        await this.#queryAccountListItemAccess(list_item_id);

        //Remove list_item
        var query = 'DELETE FROM ' + list_item_table + ' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        //Remove list item-list relation
        query = 'DELETE FROM ' + list_item_relation + ' WHERE `list_id`=' + list_id + ' AND `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List Item ' + list_item_id + ' removed');
    }

    //Add/Edit description to list item
    async editItemDescription(list_item_id, newDesc) {
        await this.#queryAccountListItemAccess(list_item_id);

        const query = 'UPDATE ' + list_item_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List item description change');
    }

    //Rate list item
    async editItemRating(list_item_id, rating) {
        await this.#queryAccountListItemAccess(list_item_id);

        const query = 'UPDATE ' + list_item_table + ' SET `rating`=\'' + rating + '\' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List item rating changed');
    }

    //Change list item name
    async editItemName(list_item_id, name) {
        await this.#queryAccountListItemAccess(list_item_id);

        const query = 'UPDATE ' + list_item_table + ' SET `name`=\'' + name + '\' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List item name changed');
    }

    //Get all lists from Database
    async getLists(callback) {
        const query = 'SELECT list.name AS \'listname\', list.desc AS \'listdesc\', list_item.name AS \'itemname\', list_item.desc AS \'itemdesc\', list_item.rating AS \'rating\', list_item.link AS \'link\' FROM ' + account_list_relation + ' JOIN ' + list_item_relation + ' USING(list_id) JOIN ' + list_table + ' USING(list_id) JOIN ' + list_item_table + ' USING(list_item_id) WHERE `account_id`=' + this.account_id;
        this.Connection.query(query, function (err, rows, fields) {
            if (err) callback(err, null);

            let list = {};
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

    disconnect() {
        this.Connection.disconnect();
    }

    /*Helper functions*/
    #queryVerifyName(name) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT name FROM ' + list_table + ' JOIN ' + account_list_relation + ' USING(list_id);';
            this.Connection.query(query, function (err, rows, fields) {
                if (err) throw err;

                for (var i = 0; i < rows.length; i++) {
                    if (name == rows[i].name) reject(new Error('Name already exists!'));
                }
                resolve();
            });
        });
    }

    #queryGenerateListId() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT MAX(list_id) FROM ' + list_table;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                let list_id = rows[0]['MAX(list_id)'] + 1;
                if (typeof list_id != 'number') list_id = 0;
                resolve(list_id);
            });
        });
    }

    #queryGenerateListItemId() {
        return new Promise((resolve, reject) => {
            const query = 'SELECT MAX(list_item_id) FROM ' + list_item_relation;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                let list_item_id = rows[0]['MAX(list_item_id)'] + 1;
                if (typeof list_item_id != 'number') list_item_id = 0;
                resolve(list_item_id);
            });
        });
    }

    #quickQuery(query) {
        return new Promise((resolve, reject) => {
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);
                resolve();
            });
        });
    }

    #queryAccountListAccess(list_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT list_id FROM ' + account_list_relation + ' WHERE `account_id`=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                for (var i = 0; i < rows.length; i++) {
                    if (list_id == rows[i].list_id) resolve();
                }
                reject(new Error('ERROR: Illegal access to list!'));
            });
        });
    }

    #queryAccountListItemAccess(list_item_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT list_item_id FROM ' + account_list_relation + ' JOIN ' + list_item_relation + ' USING(list_id) ' + ' WHERE `account_id`=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                for (var i = 0; i < rows.length; i++) {
                    if (list_item_id == rows[i].list_item_id) resolve();
                }
                reject(new Error('ERROR: Illegal access to list!'));
            });
        });
    }
}

module.exports = ListBackend;

//Testing
async function test() {
    var list = new ListBackend(1);
    await list.createList('new', 'desc');
    await list.editListName(1, 'new name');
    await list.editListDescription(1, 'new desc');
    await list.addListItem(1, 'Aple', 'www.yelp.com/asfsdhkgdl', 'local apple store', 4);
    await list.editItemDescription(1, 'hated apple store');
    await list.editItemRating(1, 1);
    await list.editItemName(1, '2nd Apple Store');
    await list.getLists((err, list) => {
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
    //await list.removeListItem(1, 1, 1);
    //await list.removeList(1, 1);
    
    list.disconnect();   //Must disconnect before exiting page
}
//test();