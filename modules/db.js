var mysql2 = require('mysql2');
var db = require('mysql-promise')();
 
var conf = {
  "host": process.env.DATABASE_HOST,
  "user": process.env.DATABASE_USER,
  "password": process.env.DATABASE_PASSWORD,
  "database": process.env.DATABASE,
  "port": process.env.DATABASE_PORT || 3306
};

console.log ("connecting to ", conf);

db.configure(conf);

module.exports = db;
