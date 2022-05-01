var mysqlConnection = require("../MySQL/mysqlConnection");
const yelp = require('yelp-fusion'); //Source: https://github.com/tonybadguy/yelp-fusion
const yelp_client = yelp.client('jw1QTKNWV6TdHa85nyk7ZCqS2IMQYyu0RVWbED6-3ha2r4B1AEZ_G1yX5f93JDaCR798BScRnZ0SGfyheSzkUDA-wA_DxuDfWMgcp7qMLEF56nTMkiZZw_IcfBgsYnYx');
const util = require('util');

var SettingsBackend = require('../Settings/SettingsBackend');
var ListBackend = require('../BusinessList/ListBackend');

const QUERYLIMIT = 50;  //Default: 20, Maximum: 50

//mySQL tables

//TODO:
//-Searchbar frontend to finish
// *getList should return lists without list items
// *Merge home page/login
//-Business bug: rating not displyed properly after select (can be left alone)

class Search {
    constructor(account_id) {
        this.account_id = account_id
        this.Connection = new mysqlConnection();

        this.disconnect = this.disconnect.bind(this);
        this.search = this.search.bind(this);
        this.getDefaultFilters = this.getDefaultFilters.bind(this);
        this.getListNamesAndIds = this.getListNamesAndIds.bind(this);
        this.getLists = this.getLists.bind(this);
        //this.#processPriceRange;
    }

    //Connection
    disconnect() {
        this.Connection.disconnect();
    }

    //According to API, location is required
    //Search (handle all filters)
    async search(keywords, location, sort_by, radius, rating, price, open, in_list, not_list, callback) {
        let open_now = false;
        if (radius === -1) radius = 40000;
        if (price === '') price = '1,2,3,4';
        if (open === 1){
            open = true;
        } else {
            open = false;
        }

        let results = {};
        let response = await yelp_client.search({ //Will take a bit to load
            'term': keywords,
            'location': location,
            'sort_by': sort_by,
            'radius': radius,   //In meters
            'price': price,
            'open_now': open_now,
            'limit': QUERYLIMIT
        });

        //Required to filter by hand: rating, in/not_list (use link vs .url)
        results = response.jsonBody.businesses;

        let inListLinks = [];
        let notListLinks = [];
        this.getLists(in_list, not_list, await util.promisify((lists) => {
            if (lists['in_list']) {
                lists['in_list']['items'].forEach((item, i) => {
                    inListLinks.push(lists['in_list']['items'][i]['link']);
                });
            }
            if (lists['not_list']) {
                lists['not_list']['items'].forEach((item, i) => {
                    notListLinks.push(lists['not_list']['items'][i]['link']);
                });
            }

            if (inListLinks.length != 0) {
                results = results.filter((business) => {
                    return inListLinks.includes(business.url);  //Filter in_list
                });
            }

            if (notListLinks.length != 0) {
                results = results.filter((business) => {
                    return !notListLinks.includes(business.url);    //Filter not_list
                });
            }
            if (rating !== -1) {
                results = results.filter((business) => {
                    return business.rating >= rating;    //Filter rating
                });
            }
            callback(results);
        }));
    }

    //Get default filters
    async getDefaultFilters() {
        //Names: 
        let names = ['distance', 'rating', 'price', 'open', 'in_list', 'not_list']
        let Settings = new SettingsBackend(this.account_id);
        let filters = {};
        for (let i = 0; i < names.length; i++) {
            filters[names[i]] = await Settings.getFilter(names[i]);
        }
        filters['address'] = await Settings.getAddress();
        Settings.disconnect();
        return filters;
    }

    getListNamesAndIds(callback) {
        let listBackend = new ListBackend(this.account_id);
        let results = {};
        listBackend.getLists((err, lists) => {
            if (err) throw err;
            for (const listName in lists) {
                results[listName] = lists[listName].id;
            }
            callback(results);
            listBackend.disconnect();
        });
    }

    async getLists(inListName, notListName, callback) {
        let listBackend = new ListBackend(this.account_id);
        let results = {};
        await listBackend.getLists((err, lists) => {
            if (err) throw err;
            for (var listName in lists) {
                if (listName === inListName) {
                    results['in_list'] = lists[listName];
                }
                if (listName === notListName) {
                    results['not_list'] = lists[listName];
                }
            }
            callback(results);
        });
        listBackend.disconnect();
    }

    //Deprecated
    #processPriceRange(min, max) {
        let rank_min = 1;
        if (min >= 20) rank_min++;
        if (min >= 50) rank_min++;
        if (min >= 70) rank_min++;

        let rank_max = 4;
        if (max < 70) rank_max--;
        if (max < 50) rank_max--;
        if (max < 20) rank_max--;
        if (max === -1) rank_max = 4;

        let output = '';
        for (let i = rank_min; i < rank_max; i++) {
            output += i + ', ';
        }
        return output + rank_max;
    }

}

async function test() {
    var search = new Search(663);
    await search.search('fast food', 'san jose, 95112', 'distance', -1, -1, -1, 0, 'new name 2', 'list3', await util.promisify((x) => {
       for (let key in x) {
            console.log(x[key].name + ' - ' + x[key].url);
        }
    }));
    
    search.getListNamesAndIds(await util.promisify((results) => {
        console.log(results);
    }));

    console.log(await search.getDefaultFilters());



    search.disconnect();
}

//test();
module.exports = Search;