const Router = require('express')
const router = new Router()
const deliveryController = require('../controllers/deliveryController')

router.post('/', deliveryController.create)
router.get('/', deliveryController.getAll)
router.delete('/', deliveryController.remove)

module.exports = router