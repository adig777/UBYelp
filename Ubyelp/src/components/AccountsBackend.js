var mysqlConnection = require("./mysqlConnection");

const accounts_table = "account";
const settings_table = "settings";

class Accounts {
    constructor() {
        this.Connection = new mysqlConnection();

        this.disconnect = this.disconnect.bind(this);
        this.logIn = this.logIn.bind(this);
        this.createAccount = this.createAccount.bind(this);

        this.#queryLogIn;
        this.#queryValueExists;
        this.#quickQuery;
    }

    //Connection
    disconnect() {
        this.Connection.disconnect();
    }

    //Log in
    async logIn(username, password) {
        let id = await this.#queryLogIn(username, password);
        if (id != -1) {
            console.log('Account ' + id + ' logged in');
        }
        return id;
    }

    //Create account
    async createAccount(username, password, repeatPassword, email) {
        //Input check
        if (username === '') throw 'Username cannot be empty';
        if (password !== repeatPassword) throw 'Passwords do not match';
        if (email === '') throw 'Please provide your email';

        //Non-duplicate username (email could be unique)
        if (await this.#queryValueExists('username', username)) throw 'Username already exists';

        //Create id based on user hash
        let id = 0;
        for (let i = 0; i < username.length; i++) {
            id += username.charCodeAt(i) + (11 * i % 7);
        }

        //Check if id is unique
        while (await this.#queryValueExists('account_id', id)) id += 1;

        //Add to database
        let query = 'INSERT INTO ' + accounts_table + ' (`email`, `username`, `password`, `account_id`) VALUES (\'' + email + '\', \'' + username + '\', \'' + password + '\', ' + id + ')';
        await this.#quickQuery(query);

        //Create settings entry
        query = 'INSERT INTO ' + settings_table + ' (`account_id`) VALUES (' + id + ')';
        await this.#quickQuery(query);

        console.log('Account created');
        return id;
    }

    //[Recover password (send email)]

    #queryLogIn(username, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT account_id FROM ' + accounts_table + ' WHERE username=\'' + username + '\' AND password=\'' + password + '\'';
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);
                if (rows.length!=1) {
                    resolve(-1);
                } else {
                    resolve(rows[0].account_id);
                }
            });
        });
    }

    #queryValueExists(column, value) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT ' + column + ' FROM ' + accounts_table + ' WHERE ' + column + '=\'' + value + '\'';
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);
                resolve(rows.length != 0);
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
}

module.exports = Accounts;

async function test() {
    let accounts = new Accounts();
    //await accounts.logIn('user', 'password');
    try {
        await accounts.logIn('myUser', 'pass');
    } catch (error) {
        console.log(error);
    }
    accounts.disconnect();
}

//test();
