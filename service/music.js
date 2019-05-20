const db = require('../config/db.js')
const show = (...args) => {
	let passIn = args
	return new Promise((resolve, reject) => {
		let sql, params
		if(Array.isArray(passIn[0])){
			sql = 'select ?? from ?? '
			if(passIn[0][2]){
				if(Object.prototype.toString.call(passIn[0][2]) !== "[object Object]"){
					throw new Error('the third element must be object')
				}
				let obj = passIn[0][2]
						keys = Object.keys(obj)
				sql += ' where 1 = 1'
				for(let i = 0; i < keys.length; i++){
					sql += ` and ${keys[i]} = ${obj[keys[i]]} `
				}
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