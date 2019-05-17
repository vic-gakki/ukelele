const bodyParser = require('body-parser')
const music = require('../service/music.js')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const jsonParser = bodyParser.json()
const router = app => {
	app.get('', (req, res) => {
		res.redirect('/home')
	})
	app.get('/home', (req, res) => {
		music.show(['*', 'music']).then(result => {
			console.log(result.length)
			res.render('home.html', {
				result
			})
		})
		.catch(err => {
			console.log(err)
		})
	})
	app.get('/test', (req, res) => {
		res.render('test.html')
	})
	app.get('/compose', (req, res) => {
		res.render('compose.html')
	})
	app.get('/testmysql', (req, res) => {
		music.show('select * from music').then(result => {
			res.send(result)
		})
		.catch(err => {
			console.log(err)
		})
	})
	app.get('/sample', (req, res) => {
		res.render('ssrCompose.html', {
			title: '生日快乐',
			beatNum: 3,
			beatMelody: 4,
			containerWidth: 1000,
			rowMargin: 60,
			compose: [
				{"isEmpty":true},{"isExtend":true,"string":2,"flats":"︶"},{"string":3,"flats":"1"},{"isHalf":true,"string":4,"flats":"1 ½"}
			],
			melodyOffset: 100,
			assistantHeight: 30,
			seperatorColor: 'rgba(0, 0, 0, .6)'
		})
	})
}
module.exports = router