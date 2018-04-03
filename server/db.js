const mysql = require('mysql')
let db = {}

//获取数据库连接
db.connection = function () {
  //数据库配置  
  let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'metro'
  })
  //数据库连接
  connection.connect(err => {
    if (err) {
      console.log(err)
      return
    }
    console.log('----connected----')
  })
  return connection
}

//关闭数据库
db.close = function (connection) {
  //关闭连接
  connection.end(err => {
    if (err) {
      return
    }
    console.log('----closed----')
  })
}

//使用异步返回查询结果
db.query = function (sql, params, callback) {
  let conn = db.connection()
  conn.query(sql, params, callback)
  db.close(conn)
}

module.exports = db
