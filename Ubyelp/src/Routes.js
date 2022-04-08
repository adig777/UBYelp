const express = require('express');
//import Connection from './mysqlConnection';
const AccountsBackend = require('./components/AccountsBackend');

var accounts = new AccountsBackend();
const app = express();

app.use(express.json());                            //body parser
app.use(express.urlencoded({ extended: true }));    //body parser

app.post('/login', async (req, res) => {
    let loginAttempt = JSON.parse(Object.keys(req.body)[0]);
    let id = await accounts.logIn(loginAttempt.username, loginAttempt.password);
    res.end(''+id); //If returned -1, login failed
});

app.listen(3001, () => {
    console.log('Route.js running');
});