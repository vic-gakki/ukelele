const bodyParser = require('body-parser')
const music = require('../service/music.js')
const urlencodedParser = bodyParser.urlencoded({extended: false})
const jsonParser = bodyParser.json()
const router = app => {
	app.get('', (req, res) => {
		music.show('select * from music').then(result => {
			res.send(result[0])
		})
		.catch(err => {
			console.log(err)
		})
	})
	app.get('/test', (req, res) => {
		res.render('ssrCompose.html', {
			title: '生日快乐',
			num: 3,
			note: 4,
			count: 3,
			containerWidth: 1000,
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
				{string: 1, flats: '4'},
				{string: 1, flats: '~', isExtend: true},
				{string: 4, flats: '1'},
				{string: 1, flats: '3'}
			],
			offset: 100,
			assistantHeight: 30,
			seperatorColor: '#f10215'
		})
	})
}
module.exports = router