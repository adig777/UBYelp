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
const mysqlConnection = require("../MySQL/mysqlConnection");

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
        this.#queryVerifyListItem;
        this.#queryGenerateListId;
        this.#queryGenerateListItemId;
        this.#quickQuery;
        this.#queryAccountListAccess;
        this.#queryAccountListItemAccess;
        this.#queryGetListIds;
        this.#getListsPart2;
    }

    //Create List (Requires: name)
    async createList(name, desc) {
        //Check if name exists
        if (name == '') return 'List name cannot be empty!'
        if(await this.#queryVerifyName(name)) return 'Name already exists!';

        //Generate list id
        var list_id = await this.#queryGenerateListId();
        var query = 'INSERT INTO ' + list_table + ' (`list_id`, `name`, `desc`) VALUES (' + list_id + ', \'' + name + '\', \'' + desc + '\');';

        //Create list
        await this.#quickQuery(query);

        //Create account-list relation
        query = 'INSERT INTO ' + account_list_relation + ' (`account_id`, `list_id`) VALUES (' + this.account_id + ', ' + list_id + ');';
        await this.#quickQuery(query);

        console.log('List ' + list_id + ' created');
        return list_id;
    }

    //Remove list
    async removeList(list_id) {
        //Verify access
        if (!await this.#queryAccountListAccess(list_id)) return 'Illegal access to list';

        //Remove list-items in list
        let list_item_ids = await this.#queryGetListIds(list_id);
        console.log(list_item_ids);
        for (let i = 0; i < list_item_ids.length; i++) {
            await this.removeListItem(list_id, list_item_ids[i]);
        }

        //Remove account-list relation
        query = 'DELETE FROM ' + account_list_relation + ' WHERE `account_id`=' + this.account_id + ' AND `list_id`=' + list_id;
        await this.#quickQuery(query);

        //Remove list
        var query = 'DELETE FROM ' + list_table + ' WHERE `list_id`=' + list_id;
        await this.#quickQuery(query);


        console.log('List ' + list_id + ' removed');
        return '';
    }

    //Edit title of List
    async editListName(list_id, newTitle) {
        if (!await this.#queryAccountListAccess(list_id)) return 'Illegal access to list';

        var query = 'UPDATE ' + list_table + ' SET `name`=\'' + newTitle + '\' WHERE `list_id`=' + list_id;
        await this.#quickQuery(query);
        console.log('List name changed');
        return '';
    }

    //Edit description of list
    async editListDescription(list_id, newDesc) {
        if (!await this.#queryAccountListAccess(list_id)) return 'Illegal access to list';

        const query = 'UPDATE ' + list_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_id`=' + list_id;
        await this.#quickQuery(query);
        console.log('List description changed');
        return '';
    }

    //Add list item (Requires: link)
    async addListItem(list_id, name, link, desc, rating) {
        if (link == '') return 'Link not provided';
        if (!await this.#queryAccountListAccess(list_id)) return 'Illegal access to list!';

        //Check if item already added
        if (await this.#queryVerifyListItem(list_id,link)) return 'Item already added';

        //Generate list item id
        let list_item_id = await this.#queryGenerateListItemId();

        //Create list item-list relation
        var query = 'INSERT INTO ' + list_item_relation + ' (`list_id`, `list_item_id`) VALUES (' + list_id + ', ' + list_item_id + ');';
        await this.#quickQuery(query);

        //Create list item
        query = 'INSERT INTO ' + list_item_table + ' (`list_item_id`, `name`, `desc`, `rating`, `link`) VALUES (' + list_item_id + ', \'' + name + '\', \'' + desc + '\', ' + rating + ', \'' + link + '\');';
        await this.#quickQuery(query);

        console.log('List item added');
        return '';
    }

    //Remove list item from list
    async removeListItem(list_id, list_item_id) {
        if(!await this.#queryAccountListItemAccess(list_item_id)) return 'Illegal access to list!';

        //Remove list_item
        var query = 'DELETE FROM ' + list_item_table + ' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        //Remove list item-list relation
        query = 'DELETE FROM ' + list_item_relation + ' WHERE `list_id`=' + list_id + ' AND `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List Item ' + list_item_id + ' removed');
        return '';
    }

    //Add/Edit description to list item
    async editItemDescription(list_item_id, newDesc) {
        if (!await this.#queryAccountListItemAccess(list_item_id)) return 'Illegal access to list!';

        const query = 'UPDATE ' + list_item_table + ' SET `desc`=\'' + newDesc + '\' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List item description change');
        return '';
    }

    //Rate list item
    async editItemRating(list_item_id, rating) {
        if (!await this.#queryAccountListItemAccess(list_item_id)) return 'Illegal access to list!';

        const query = 'UPDATE ' + list_item_table + ' SET `rating`=\'' + rating + '\' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List item rating changed');
        return '';
    }

    //Change list item name
    async editItemName(list_item_id, name) {
        if (!await this.#queryAccountListItemAccess(list_item_id)) return 'Illegal access to list!';

        const query = 'UPDATE ' + list_item_table + ' SET `name`=\'' + name + '\' WHERE `list_item_id`=' + list_item_id;
        await this.#quickQuery(query);

        console.log('List item name changed');
        return '';
    }

    //Get all non-empty lists from Database
    async getLists(callback) {
        let part2 = this.#getListsPart2;
        let id = this.account_id;
        let connection = this.Connection;
        const listQuery = 'SELECT list_id, list.name AS \'listname\', list.desc AS \'listdesc\' FROM ' + account_list_relation + ' JOIN ' + list_table + ' USING(list_id) WHERE account_id=' + this.account_id;
        this.Connection.query(listQuery, function (err, rows, fields) {
            if (err) callback(err, null);

            let list = {};
            for (var i = 0; i < rows.length; i++) {
                list[rows[i].listname] = {
                    'id': rows[i].list_id,
                    'name': rows[i].listname,
                    'desc': rows[i].listdesc,
                    'items': []
                }
            }
            part2(id, list, connection, callback);
        });
    }

    async #getListsPart2(id, list, connection, callback) {
        const lIQuery = 'SELECT list_item_id, list.name AS \'listname\', list_item.name AS \'itemname\', list_item.desc AS \'itemdesc\', list_item.rating AS \'rating\', list_item.link AS \'link\' FROM ' + account_list_relation + ' JOIN ' + list_item_relation + ' USING(list_id) JOIN ' + list_table + ' USING(list_id) JOIN ' + list_item_table + ' USING(list_item_id) WHERE `account_id`=' + id;
        console.log(lIQuery);
        connection.query(lIQuery, function (err2, rows2, fields) {
            if (err2) callback(err2, null);

            for (var i = 0; i < rows2.length; i++) {
                let listitem = {
                    'id': rows2[i].list_item_id,
                    'name': rows2[i].itemname,
                    'desc': rows2[i].itemdesc,
                    'rating': rows2[i].rating,
                    'link': rows2[i].link
                };
                list[rows2[i].listname]['items'].push(listitem);
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
            const query = 'SELECT name FROM ' + list_table + ' JOIN ' + account_list_relation + ' USING(list_id) WHERE account_id=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) throw err;

                for (var i = 0; i < rows.length; i++) {
                    if (name == rows[i].name) resolve(true);
                }
                resolve(false);
            });
        });
    }

    #queryVerifyListItem(list_id, link) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT link FROM ' + list_table + ' JOIN ' + account_list_relation + ' USING(list_id) JOIN ' + list_item_relation + ' USING(list_id) JOIN ' + list_item_table + ' USING(list_item_id) WHERE account_id = ' + this.account_id + ' AND list_id = ' + list_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) throw err;

                for (var i = 0; i < rows.length; i++) {
                    if (link == rows[i].link) resolve(true);
                }
                resolve(false);
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

    #queryGetListIds(list_id) {
        return new Promise((resolve, reject) => {
            var query = 'SELECT list_item_id FROM ' + list_item_relation + ' JOIN ' + list_table + ' USING(list_id) WHERE list_id = ' + list_id;
            this.Connection.query(query, async function (err, rows, fields) {
                if (err) reject(err);

                var ids = [];
                for (var i = 0; i < rows.length; i++) {
                    ids.push(rows[i].list_item_id);
                }
                resolve(ids);
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
                    if (list_id == rows[i].list_id) resolve(true);
                }
                resolve(false);
            });
        });
    }

    #queryAccountListItemAccess(list_item_id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT list_item_id FROM ' + account_list_relation + ' JOIN ' + list_item_relation + ' USING(list_id) ' + ' WHERE `account_id`=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                for (var i = 0; i < rows.length; i++) {
                    if (list_item_id == rows[i].list_item_id) resolve(true);
                }
                resolve(false);
            });
        });
    }
}

module.exports = ListBackend;

//Testing
async function test() {
    var List = new ListBackend(663);
    //await List.createList('list6', 'desasd  a s ac');
    //await List.editListName(1, 'new name 2');
    //await List.editListDescription(1, 'new desc');
    //await List.addListItem(6, 'Aple', 'www.yelp.com/asfsdhkgdl', 'local apple store', 4);
    //await List.addListItem(6, 'Aple', 'www.yelp.com/asfsdhkgdl', 'local apple store', 4);   //Repeat - test handling duplicates
    //await List.editItemDescription(16, 'old apple store');
    //await List.editItemRating(16, 2.5);
    //await List.editItemName(16, '3rd Apple Store');
    await List.getLists((err, list) => {
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
        //await List.removeListItem(1, 1);
        //await List.removeList(5);

        List.disconnect();   //Must disconnect before exiting page
    });
    
}
//test();