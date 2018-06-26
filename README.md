# Node JS Transactions

Perform transactional MySQL queries in Node.JS


## Usage

By default, transaction initializes connections to a MySQL database using the environment variables:
* DATABASE_HOST
* DATABASE_USER
* DATABASE_PASSWORD
* DATABASE
* DATABASE_PORT (optional, defaults to 3306)

### Basic Usage
```
process.env.DATABASE_HOST ='localhost';
process.env.DATABASE_USER = 'root';
process.env.DATABASE_PASSWORD = 'password';
process.env.DATABASE = 'mysql';

var t = require('node-mysql-transactions');
var transaction = t();

var query1 = 'insert into table2 (select * from table1 where `id`=1)';
var query2 = 'delete from table1 where `id`=1';

var result = transaction([query1, query2]);
```

### Initialize with your own DB module

```var t = require('node-mysql-transactions');
var db = require('./mymodules/mydbmodule');
var transaction = t(db);

var query1 = 'insert into table2 (select * from table1 where `id`=1)';
var query2 = 'delete from table1 where `id`=1';

var result = transaction([query1, query2]);
```
