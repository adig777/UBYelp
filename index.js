const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

//create a query
const SELECT_ALL_PRODUCTS_QUERY = 'SELECT * FROM products';

//need to create a connection 
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sys' 
});


pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
  
    // Use the connection
    connection.query('SELECT something FROM sometable', function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
  
      // Handle error after the release.
      if (error) throw error;
  
      // Don't use the connection here, it has been returned to the pool.
    });
  });




connection.connect(err =>{
    if(err){
        return err;
    }
});

console.log(connection);

app.use(cors());


app.get('/', (req, res) => {
    res.send('go to /products to see products.')
});



app.get('/products', (req,res)=>{
    connection.query(SELECT_ALL_PRODUCTS_QUERY, (err, results)=>{
        if(err){
            return res.send(err)
        }else{
            return res.json({
                data: results
            })
        }
    })
});

app.listen(4000, () => {
    console.log('Product server listerning on port 4000')
});




/*

var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'example.org',
  user            : 'bob',
  password        : 'secret',
  database        : 'my_db'
});

pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
This is a shortcut for the pool.getConnection() -> connection.query() -> connection.release() code flow. Using pool.getConnection() is useful to share connection state for subsequent queries. This is because two calls to pool.query() may use two different connections and run in parallel. This is the basic structure:

var mysql = require('mysql');
var pool  = mysql.createPool(...);

pool.getConnection(function(err, connection) {
  if (err) throw err; // not connected!

  // Use the connection
  connection.query('SELECT something FROM sometable', function (error, results, fields) {
    // When done with the connection, release it.
    connection.release();

    // Handle error after the release.
    if (error) throw error;

    // Don't use the connection here, it has been returned to the pool.
  });
});


*/
