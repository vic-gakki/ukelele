const express = require('express')
const router = require('./router')
const app = express()
app.use('/lib', express.static('./lib'))
app.engine('html', require('express-art-template'))
router(app)
app.listen(3000, () => {
	console.log('server start!')
})
