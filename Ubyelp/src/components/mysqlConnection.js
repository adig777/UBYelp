const mysql = require('mysql');

class Connection {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'UBYelp',
            password: 'cs160UBY3!p',
            database: 'ubyelp'
        });

        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.query = this.query.bind(this);
    }

    query(queue, callback) {
        this.connection.query(queue, callback);
    }

    //Connect to database (helper method)
    connect() {
        this.connection.connect((err) => {
            if (err) throw err;
        });
    }

    disconnect() {
        //Render page
        this.connection.end();
    }
}


module.exports = Connection;