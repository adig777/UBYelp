const express = require('express');
const util = require('util');
//import Connection from './mysqlConnection';
const AccountsBackend = require('./components/Signup/AccountsBackend');
const SearchBackend = require('./components/Searchbar/SearchBackend');
const ListBackend = require('./components/BusinessList/ListBackend');

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
    await Search.search(input.keywords, input.location, input.sort_by, input.radius, input.rating, input.price, input.open, input.in_list, input.not_list, await util.promisify((searchResults) => {
        res.end(JSON.stringify(searchResults))
    }));
});

app.post('/defaultfilters', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Search = new SearchBackend(input.id);
    res.end(JSON.stringify(await Search.getDefaultFilters()));
});

app.post('/listnames', (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Search = new SearchBackend(input.id);
    Search.getListNames((names) => {
        res.end(JSON.stringify(names));
    });
});

app.post('/addlistitem', async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let List = new ListBackend(input.id);
    await List.addListItem()
    //list_id, name, link, desc, rating
});



app.listen(3001, () => {
    console.log('Route.js running');
});

/* Fetch calls saved here until Front-ends are done

//SearchBar
fetch('http://localhost:3001/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                //Temporary variables used 
                //Alternative option: JSON.stringify(this.filters)
                id: id,
                keywords: 'fast food',
                location: 'san jose, 95112',
                sort_by: 'distance',
                radius: -1,
                rating: -1,
                price: '',
                open: 0,
                in_list: '',
                not_list: ''
            })
        }).then((response) => response.json()
        ).then((result) => {
            //Send to account_id and results BusinessList
            navigate('/results', { 'state': { 'id': id, 'results': result } });
        });

//Get Default Filters
fetch('http://localhost:3001/defaultfilters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id': id
            })
        }).then((response) => response.json()
        ).then((filters) => {
            console.log(filters);
            //this.filters = filters
        });

//Get list names
fetch('http://localhost:3001/listnames', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'id': id
            })
        }).then((response) => response.json()
        ).then((names) => {
            //Set in_list and not_list's dropdown menu values to 'names'
            //Format: {'list_name': 'list_id', ...}
        });
*/