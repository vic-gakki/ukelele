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
	app.get('/compose', (req, res) => {
		
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
				{string: 4, flats: '2'},
				{string: 1, flats: '3'},
				{string: 2, flats: '3'},
				{string: 3, flats: '3'},
				{string: 1, flats: '1'},
				{string: 1, flats: '4'},
				{string: 1, flats: '4'},
				{string: 1, flats: '3', isHalf: true},
				{string: 2, flats: '2', isHalf: true},
				{string: 4, flats: '3'},
				{string: 1, flats: '4'},
				{string: 1, flats: '~', isExtend: true},
				{string: 4, flats: '1'},
				{string: 1, flats: '3'},
				{string: 4, flats: '2'},
				{string: 1, flats: '3'},
				{string: 2, flats: '3'},
				{string: 3, flats: '3'},
				{string: 1, flats: '1'},
				{string: 1, flats: '3', isHalf: true},
				{string: 2, flats: '2', isHalf: true},
				{string: 4, flats: '3'},
				{string: 1, flats: '~', isExtend: true},
				{string: 4, flats: '1'},
				{string: 1, flats: '3'},
				{string: 4, flats: '2'},
				{string: 1, flats: '3'},
				{isEmpty: true},
				{string: 2, flats: '3'},
				{string: 3, flats: '3'},
				{string: 1, flats: '1'},
				{string: 1, flats: '3', isHalf: true},
				{string: 2, flats: '2', isHalf: true},
				{string: 4, flats: '3'},
				{string: 1, flats: '4'},
				{flats: '~', isExtend: true},
				{string: 4, flats: '1'},
				{string: 1, flats: '3'},
				{string: 4, flats: '2'},
				{string: 1, flats: '3'},
				{string: 2, flats: '3'},
				{string: 3, flats: '3'},
				{string: 1, flats: '1'},
				{string: 1, flats: '3', isHalf: true},
				{string: 2, flats: '2', isHalf: true},
				{string: 4, flats: '3'},
				{string: 1, flats: '4'},
				{flats: '~', isExtend: true},
				{string: 4, flats: '1'},
				{string: 1, flats: '3'}
			],
			melodyOffset: 100,
			assistantHeight: 30,
			seperatorColor: 'rgba(0, 0, 0, .6)'
		})
	})
}
module.exports = router