const mysql = require('mysql')
const pool = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'gakki',
	database: 'compose'
})
const query = (sql, params, callback) => {
	pool.getConnection((connErr, connection) => {
		if(connErr) throw connErr
		connection.query(sql, params, (sqlErr, result) => {
			callback(sqlErr, result)
			connection.release()
		})
	})
}
module.exports = {
	query
}