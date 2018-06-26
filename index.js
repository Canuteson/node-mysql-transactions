var Promise = require('bluebird');

module.exports = function(database) {
  var db = database || require('./modules/db');
  Promise.promisifyAll(db.pool);
  return async function (queries) {
    return new Promise(async function(res, rej) {

      let connection = db.pool.getConnectionAsync();
      let conn = await connection;
      let completion_message = 'transaction complete for ' + queries.length + ' queries';
      let sql;
      Promise.promisifyAll(conn);

      await conn.beginTransactionAsync();
      console.log('started transaction');
      console.log(queries.length + ' queries to be executed');

      console.log('iterating through queries');
      try {
        for (var i=0; i<queries.length; i++){
          sql = queries[i];
          let query_promise = queryPromise(conn, sql);
          let query_result = await query_promise;
          let queryNum = i + 1;
          console.log('query ' + queryNum + ' completed successfully');
        }
        conn.commit();
        conn.release();
        res({status: 'success', message: completion_message});
      } catch (err) {
        console.log('Error occurred in transaction');
        completion_message = 'transaction failed on query:\n' + sql + '\nerror:\n' + err.code + ':' + err.message;
        console.log(completion_message);
        console.log('rolling back transaction');
        conn.rollback();
        conn.release();
        rej({status: 'failed', message: completion_message});
      }
    });
  }
};

var transaction = async function (db, queries) {
  return new Promise(async function(res, rej) {

    let connection = db.pool.getConnectionAsync();
    let conn = await connection;
    let completion_message = 'transaction complete for ' + queries.length + ' queries';
    let sql;
    Promise.promisifyAll(conn);

    await conn.beginTransactionAsync();
    console.log('started transaction');
    console.log(queries.length + ' queries to be executed');

    console.log('iterating through queries');
    try {
      for (var i=0; i<queries.length; i++){
        sql = queries[i];
        let query_promise = queryPromise(conn, sql);
        let query_result = await query_promise;
        let queryNum = i + 1;
        console.log('query ' + queryNum + ' completed successfully');
      }
      conn.commit();
      conn.release();
      res({status: 'success', message: completion_message});
    } catch (err) {
      console.log('Error occurred in transaction');
      completion_message = 'transaction failed on query:\n' + sql + '\nerror:\n' + err.code + ':' + err.message;
      console.log(completion_message);
      console.log('rolling back transaction');
      conn.rollback();
      conn.release();
      rej({status: 'failed', message: completion_message});
    }
  });
}

var queryPromise = async function(conn, sql) {
  return new Promise(function(resolve, reject) {
    conn.query(sql, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  })
};
