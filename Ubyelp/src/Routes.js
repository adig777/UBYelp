const express = require('express');
const util = require('util');
//import Connection from './mysqlConnection';
const AccountsBackend = require('./components/Signup/AccountsBackend');
const SearchBackend = require('./components/Searchbar/SearchBackend');
const ListBackend = require('./components/BusinessList/ListBackend');
const SettingsBackend = require('./components/Settings/SettingsBackend');

var accounts = new AccountsBackend();
const app = express();

app.use(express.json());                            //body parser
app.use(express.urlencoded({ extended: true }));    //body parser

app.post('/login', async (req, res) => {
    let loginAttempt = JSON.parse(Object.keys(req.body)[0]);
    let id = await accounts.logIn(loginAttempt.username, loginAttempt.password);
    res.end(''+id); //If returned -1, login failed
});

app.post('/signup', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let id = await accounts.createAccount(input.username, input.password, input.email);
    res.end(''+id); //Returns message, if failed
});

app.post('/search', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Search = new SearchBackend(input.id);
    try {
        await Search.search(input.keywords, input.location, input.sort_by, input.radius, input.rating, input.price, input.open, input.in_list, input.not_list, await util.promisify((searchResults) => {
            res.end(JSON.stringify(searchResults))
        }));
    } catch (exception) {
        res.end(JSON.stringify({}));
    } finally {
        Search.disconnect();
    }
});

app.post('/defaultfilters', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Search = new SearchBackend(input.id);
    res.end(JSON.stringify(await Search.getDefaultFilters()));
});

app.post('/listnames', (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Search = new SearchBackend(input.id);
    Search.getListNamesAndIds((names) => {
        res.end(JSON.stringify(names));
    });
});

app.post('/addlistitem', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.account_id);
    let result = await List.addListItem(input.list_id, input.name, input.link, input.desc, input.rating);
    List.disconnect();
    res.end(result);
});

app.post('/deletelistitem', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.account_id);
    let result = await List.removeListItem(input.list_id, input.list_item_id);
    List.disconnect();
    res.end(result);
});

app.post('/deletelist', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.account_id);
    let result = await List.removeList(input.list_id);
    List.disconnect();
    res.end(result);
});

app.post('/editlistname', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.id);
    let result = await List.editListName(input.list_id, input.newTitle);
    List.disconnect();
    res.end(result);
});

app.post('/editlistdesc', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.id);
    let result = await List.editListDescription(input.list_id, input.newDesc);
    List.disconnect();
    res.end(result);
});

app.post('/edititemdesc', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.account_id);
    let result = await List.editItemDescription(input.list_item_id, input.newDesc);
    List.disconnect();
    res.end(result);
});

app.post('/edititemrating', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.account_id);
    let result = await List.editItemRating(input.list_item_id, input.rating);
    List.disconnect();
    res.end(result);
});

app.post('/edititemname', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.account_id);
    let result = await List.editItemName(input.list_item_id, input.name);
    List.disconnect();
    res.end(result);
});

app.post('/setdistance', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Settings = new SettingsBackend(input.account_id);
    let result = await Settings.setFilterDistance(input.newFilter);
    Settings.disconnect();
    res.end(result);
});

app.post('/setrating', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Settings = new SettingsBackend(input.account_id);
    let result = await Settings.setFilterRating(input.newFilter);
    Settings.disconnect();
    res.end(result);
});

app.post('/setprice', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Settings = new SettingsBackend(input.account_id);
    let result = await Settings.setFilterPrice(input.newprices);
    Settings.disconnect();
    res.end(result);
});

app.post('/setopen', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Settings = new SettingsBackend(input.account_id);
    let result = await Settings.setFilterOpen(input.newFilter);
    Settings.disconnect();
    res.end(result);
});

app.post('/setinlist', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Settings = new SettingsBackend(input.account_id);
    let result = await Settings.setFilterInList(input.listName);
    Settings.disconnect();
    res.end(result);
});

app.post('/setnotlist', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Settings = new SettingsBackend(input.account_id);
    let result = await Settings.setFilterNotInList(input.listName);
    Settings.disconnect();
    res.end(result);
});

app.post('/getlists', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.id);
    await List.getLists((err, list) => {
        res.end(JSON.stringify(list));
    });
    List.disconnect();
});

app.post('/createlist', async(req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.id);
    let result = await List.createList(input.name, input.desc);
    List.disconnect();
    res.end(result);
    });

// app.post('/listnamesandid', (req, res) => {
//     let input = JSON.parse(Object.keys(req.body)[0]);
//     let Search = new SearchBackend(input.id);
//     Search.getListNamesAndIds((results) => {
//         res.end(results);
//     });
// });


app.listen(3001, () => {
    console.log('Route.js running');
});
