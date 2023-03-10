const Router = require('express')
const router = new Router()
const orderController = require('../controllers/orderController')

router.post('/', orderController.create)
router.put('/', orderController.putOrder)
router.get('/', orderController.get)

module.exports = router