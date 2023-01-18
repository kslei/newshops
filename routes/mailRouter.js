const Router = require('express')
const router = new Router()
const mailController = require('../controllers/mailController')

router.post('/', mailController.post)

module.exports = router