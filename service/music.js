const db = require('../config/db.js')
const show = (...args) => {
	let passIn = args
	return new Promise((resolve, reject) => {
		let sql, params
		if(Array.isArray(passIn[0])){
			sql = 'select ?? from ?? '
			if(passIn[0][2]){
				sql += ' where '
			}
			params = passIn[0]
		}else {
			sql = passIn[0]
			params = passIn[1]
		}
		
		db.query(sql, params, (err, result) => {
			if(err){
				reject(err)
			}else {
				resolve(result)
			}
		})
	})
}
const insert = (table, data) => {
	return new Promise((resolve, reject) => {
		db.query('insert into ?? (??) values (?)', [table, Object.keys(data), Object.values(data)], (err, results) => {
			if(err){
				reject(err)
			}else {
				resolve(results)
			}
		})
	})
}
module.exports = {
	show,
	insert
}