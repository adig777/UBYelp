const mysqlConnection = require("../MySQL/mysqlConnection");

const accounts_table = "account";
const settings_table = "settings";
const last_open_table = "last_open";
const account_list_relation = 'has_lists';
const list_table = 'list';

class Settings {
    constructor(account_id) {
        this.account_id = account_id
        this.Connection = new mysqlConnection();

        this.disconnect = this.disconnect.bind(this);
        this.getAccountId = this.getAccountId.bind(this);
        this.getUsername = this.getUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.getEmail = this.getEmail.bind(this);
        this.setEmail = this.setEmail.bind(this);
        this.getAddress = this.getAddress.bind(this);
        this.setAddress = this.setAddress.bind(this);
        this.getTheme = this.getTheme.bind(this);
        this.setTheme = this.setTheme.bind(this);
        this.getFilter = this.getFilter.bind(this);
        this.getLastOpen = this.getLastOpen.bind(this);
        this.setFilterDistance = this.setFilterDistance.bind(this);
        this.setFilterRating = this.setFilterRating.bind(this);
        this.setFilterPrice = this.setFilterPrice.bind(this);
        this.setFilterOpen = this.setFilterOpen.bind(this);
        this.setFilterInList = this.setFilterInList.bind(this);
        this.setFilterNotInList = this.setFilterNotInList.bind(this);
        this.setLastOpen = this.setLastOpen.bind(this);

        this.#quickQuery;
        this.#queryGetAccountValue;
        this.#queryGetSettingsValue;
        this.#queryGetLastOpen;
        this.#queryVerifyListExistance;
    }

    //Connection
    disconnect() {
        this.Connection.disconnect();
    }

    //Get account id
    getAccountId() {
        return this.account_id;
    }

    //Username
    async getUsername() {
        return await this.#queryGetAccountValue('username');
    }

    //Password
    async setPassword(newPassword, repeatPassword, currentPassword) {
        if (newPassword === repeatPassword) {
            const password = await this.#queryGetAccountValue('password');
            if (currentPassword === password) {
                const query = 'UPDATE ' + accounts_table + ' SET password = \'' + newPassword + '\' WHERE account_id=' + this.account_id;
                await this.#quickQuery(query);

                console.log('Password changed');
            } else {
                throw 'Incorrect password!';    //in frontend, collect message, then display
            }
        } else {
            throw 'Passwords don\'t match!';
        }
    }

    //Email
    async getEmail() {
        return await this.#queryGetAccountValue('email');
    }

    async setEmail(email) {
        const query = 'UPDATE ' + accounts_table + ' SET email=\'' + email + '\' WHERE account_id=' + this.account_id;
        await this.#quickQuery(query);
        console.log('Email changed');
    }

    //Address
    async getAddress() {
        return await this.#queryGetSettingsValue('address');
    }

    async setAddress(address) {
        const query = 'UPDATE ' + settings_table + ' SET address=\'' + address + '\' WHERE account_id=' + this.account_id;
        await this.#quickQuery(query);
        console.log('Address changed');
    }

    //Theme
    async getTheme() {
        return await this.#queryGetSettingsValue('theme');
    }

    async setTheme(theme) {
        const query = 'UPDATE ' + settings_table + ' SET theme=\'' + theme + '\' WHERE account_id=' + this.account_id;
        await this.#quickQuery(query);
        console.log('Theme changed');
    }

    //Default filters
    async getFilter(filterName) {   //Names: 'distance', 'rating', 'price', 'open', 'in_list', 'not_list'
        return await this.#queryGetSettingsValue('filter_'+filterName);
    }

    async getLastOpen() {
        return await this.#queryGetLastOpen();
    }

    async setFilterDistance(newFilter) {
        //Check valid input (-1<=x)
        try {
            if (-1 <= newFilter) {
                const query = 'UPDATE ' + settings_table + ' SET filter_distance=' + newFilter + ' WHERE account_id=' + this.account_id;
                await this.#quickQuery(query);
                console.log('filter_distance changed');
            } else {
                throw 'Invalid input';
            }
        } catch (error) {
            throw 'Invalid input';
        }
    }

    async setFilterRating(newFilter) {
        //Check valid input (-1<=x<=5)
        try {
            if (-1 <= newFilter && newFilter <= 5) {
                const query = 'UPDATE ' + settings_table + ' SET filter_rating=' + newFilter + ' WHERE account_id=' + this.account_id;
                await this.#quickQuery(query);
                console.log('filter_rating changed');
            } else {
                throw 'Invalid input';
            }
        } catch(error) {
            throw 'Invalid input';
        }
    }

    async setFilterPrice(newPrices) {
        //Check valid input (1,2,3,4)
        try {
            newPrices = newPrices.replace(/ /g, "");    //trim whitespaces
            if (newPrices !== '') {
                const values = newPrices.split(",");
                for (let i = 0; i < values.length; i++) {
                    if (values[i] === '1'
                        || values[i] === '2'
                        || values[i] === '3'
                        || values[i] === '4') {
                        continue;
                    } else {
                        console.log('crash1');
                        throw 'Invalid input';
                    }
                }
            }
            var query = 'UPDATE ' + settings_table + ' SET filter_price=\'' + newPrices + '\' WHERE account_id=' + this.account_id;
            await this.#quickQuery(query);
            console.log('filter_price changed');
        } catch (error) {
            console.log(error);
            throw 'Invalid input';
        }
    }

    async setFilterOpen(newFilter) {
        //Check valid input (0 or 1) representing true/false
        try {
            if (newFilter == 0 || newFilter == 1) {
                var query = 'UPDATE ' + settings_table + ' SET filter_open=' + newFilter + ' WHERE account_id=' + this.account_id;
                await this.#quickQuery(query);
                console.log('filter_open changed');
            } else {
                throw 'Invalid input';
            }
        } catch (error) {
            throw 'Invalid input';
        }
    }

    async setFilterInList(listName) {
        //Check valid input (List exists)
        if(listName !== '') await this.#queryVerifyListExistance(listName);

        var query = 'UPDATE ' + settings_table + ' SET filter_in_list=\'' + listName + '\' WHERE account_id=' + this.account_id;
        await this.#quickQuery(query);
        console.log('filter_in_list changed');
    }
    async setFilterNotInList(listName) {
        //Check valid input (List exists)
        if (listName !== '') await this.#queryVerifyListExistance(listName);

        var query = 'UPDATE ' + settings_table + ' SET filter_not_list=\'' + listName + '\' WHERE account_id=' + this.account_id;
        await this.#quickQuery(query);
        console.log('filter_not_list changed');
    }

    async setLastOpen(link) {
        var query = 'INSERT INTO ' + last_open_table + ' (`account_id`, `link`) VALUES (' + this.account_id + ', ' + link + ');';
        await this.#quickQuery(query);
        console.log('last_open updated');
    }


    /*Helper functions*/
    #queryGetAccountValue(value) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT ' + value + ' FROM ' + accounts_table + ' WHERE account_id=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                resolve(rows[0][value]);
            });
        });
    }

    #queryGetSettingsValue(value) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT ' + value + ' FROM ' + settings_table + ' WHERE account_id=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                resolve(rows[0][value]);
            });
        });
    }

    #queryGetLastOpen(name) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT link FROM ' + last_open_table + ' WHERE account_id=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                resolve(rows[0][value]);
            });
        });
    }

    #queryVerifyListExistance(name) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT ' + list_table + '.name FROM ' + list_table + ' JOIN ' + account_list_relation + ' USING(list_id) WHERE account_id=' + this.account_id;
            this.Connection.query(query, function (err, rows, fields) {
                if (err) reject(err);

                for (var i = 0; i < rows.length; i++) {
                    if (name === rows[i].name) resolve();
                }
                reject(new Error('ERROR: List not found'));
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

async function test() {
    var settings = new Settings(663);
    console.log('Account id: ' + await settings.getAccountId());
    console.log('Username: ' + await settings.getUsername());
    await settings.setEmail('myEmail@gmail.com');
    console.log('Email: ' + await settings.getEmail());
    await settings.setAddress('1234 address lane');
    console.log('Address: ' + await settings.getAddress());
    await settings.setTheme('dark');
    console.log('Theme: ' + await settings.getTheme());
    await settings.setFilterDistance('35000');
    console.log('FDist: ' + await settings.getFilter('distance'));
    await settings.setFilterRating('3.0');
    console.log('FRate: ' + await settings.getFilter('rating'));
    await settings.setFilterPrice('1,2,3');
    console.log('FPrice: ' + await settings.getFilter('price'));
    await  settings.setFilterOpen('0');
    console.log('FOpen: ' + await settings.getFilter('open'));
    await  settings.setFilterInList('');
    console.log('FInList: ' + await settings.getFilter('in_list'));
    await settings.setFilterNotInList('new name 2');
    console.log('FNotList: ' + await settings.getFilter('not_list'));

    settings.disconnect();
}
test();

module.exports = Settings;