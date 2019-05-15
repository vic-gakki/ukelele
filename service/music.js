const db = require('../config/db.js')
const show = (sql, params) => {
	return new Promise((resolve, reject) => {
		db.query(sql, params, (err, result) => {
			if(err){
				reject(err)
			}else {
				resolve(result)
			}
		})
	})
}
module.exports = {
	show
}