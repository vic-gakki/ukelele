const bodyParser = require('body-parser')
const music = require('../service/music.js')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const jsonParser = bodyParser.json()
const router = app => {

	app.get('', (req, res) => {
		res.redirect('/home')
	})
	// 首页展示曲子列表
	app.get('/home', (req, res) => {
		music.show('select mid, title from music').then(result => {
			res.render('home.html', {
				result,
				isHome: true
			})
		})
		.catch(err => {
			console.log(err)
		})
	})

	// 指定曲子的详情
	app.get('/displaySheet', (req, res) => {
		let query = req.query,
				result
		music.show('select ?? from ?? as a, ?? as b where a.mstatus = ? and b.sstatus = ? and a.mid = b.music_id and a.mid = ?', [['a.title', 'a.beatNum', 'a.beatMelody', 'a.title', 'a.containerWidth', 'a.seperatorColor', 'a.melodyOffset', 'a.assistantHeight', 'a.rowMargin', 'b.compose'], 'music', 'sheets', 0, 0, query.id])
		.then(results => {
			if(!results.length) res.redirect('/home')
			result = results[0]
			result.compose = JSON.parse(result.compose)
			result.id = query.id
			if(query.admin && query.admin === 'xxv') result.editable = true
			res.render('ssrCompose.html', result)
		}).catch(err => {
			console.log(err)
		})
	})
	
	// 编曲页
	app.get('/compose', (req, res) => {
		let query = req.query,
				result = {isCompose: true}
		if(query.id && query.edit_sheets){
			music.show('select ?? from ?? where mstatus = ? and mid = ?', [['title', 'beatNum', 'beatMelody', 'title', 'containerWidth', 'seperatorColor', 'melodyOffset', 'assistantHeight', 'rowMargin', 'relatedMaxFlats'], 'music', 0, query.id])
			.then(results => {
				if(!results.length) res.redirect('/home')
				result = {...result, ...results[0]}
				result.id = query.id
				res.render('compose.html', result)
			})			
			.catch(err => {
				console.log(err)
			})
		}else {
			res.render('compose.html', result)
		}
	})
	
	// 获取指定曲子
	app.get('/sheets', (req, res) => {
		let id = req.query.id
		music.show(['*', 'sheets', {music_id: id, sstatus: 0}]).then(result => {
			if(!result.length) return res.status(404).send('Not Found')
				result[0].compose = JSON.parse(result[0].compose)
			res.json({
				code: 0,
				message: 'ok',
				data: result[0]
			})
		}).catch(err => {
			console.log(err)
		})
	})

	// 保存曲子描述信息
	app.post('/postDesc', jsonParser, (req, res) => {
		let data = req.body
		if(data.id){
			let filter = {
				mid: data.id
			}
			delete data.id
			music.update('music', data, filter).then(result => {
				res.json({
					code: 0,
					data: {
						id: filter.mid
					},
					message: ''
				})
			})
		}else{
			music.insert('music', req.body).then(result => {
				res.json({
					code: 0,
					data: {
						id: result.insertId
					},
					message: ''
				})
			}).catch(err => {
				console.log(err)
			})
		}
	})

	// 保存曲子音符集
	app.post('/postCompose', jsonParser, (req, res) => {
		let data = req.body
		if(data.update){
			let filter = {
				music_id: data.music_id
			}
			data = {
				compose: data.compose
			}
			music.update('sheets', data, filter).then(result => {
				res.json({
					code: 0,
					data: {
						id: filter.music_id
					},
					message: ''
				})
			}).catch(err => {
				console.log(err)
			})
		}else {
			music.insert('sheets', req.body).then(result => {
				res.json({
					code: 0,
					data: {
						id: result.insertId
					},
					message: ''
				})
			}).catch(err => {
				console.log(err)
			})
		}
	})
}
module.exports = router