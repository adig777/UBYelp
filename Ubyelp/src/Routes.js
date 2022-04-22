const express = require('express');
//import Connection from './mysqlConnection';
const AccountsBackend = require('./components/AccountsBackend');
const SearchBackend = require('./components/SearchBackend');

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

app.get('/search' async (req, res) => {
    let input = JSON.parse(Object.keys(req.body)[0]);
    let Search = new SearchBankend(input.id);
    Search.search('fast food', 'san jose, 95112', 'distance', -1, -1, -1, -1, 0, 'new name 2', '', await util.promisify((searchresults) => {
        res.end(searchResults)
    }));
});



app.listen(3001, () => {
    console.log('Route.js running');
});