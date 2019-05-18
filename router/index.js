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
		// music.show(['*', 'music']).then(result => {
		// 	res.render('home.html', {
		// 		result
		// 	})
		// })
		// .catch(err => {
		// 	console.log(err)
		// })
		console.log('enter home')
		res.send('hello world')
	})

	// 指定曲子的详情
	app.get('/displaySheet', (req, res) => {
		music.show('select ?? from ?? as a, ?? as b where a.mstatus = ? and b.sstatus = ? and a.mid = b.music_id and a.mid = ?', [['a.title', 'a.beatNum', 'a.beatMelody', 'a.title', 'a.containerWidth', 'a.seperatorColor', 'a.melodyOffset', 'a.assistantHeight', 'a.rowMargin', 'b.compose'], 'music', 'sheets', 0, 0, req.query.id])
		.then(results => {
			results[0].compose = JSON.parse(results[0].compose)
			res.render('ssrCompose.html', results[0])
		}).catch(err => {
			console.log(err)
		})
	})
	
	// 编曲页
	app.get('/compose', (req, res) => {
		console.log('enter compose')
		res.render('compose.html')
	})
	
	// 保存曲子描述信息
	app.post('/postDesc', urlencodedParser, (req, res) => {
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
	})

	// 保存曲子音符集
	app.post('/postCompose', urlencodedParser, (req, res) => {
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
	})
}
module.exports = router