const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), deviceController.create)
router.post('/info', checkRole('ADMIN'), deviceController.createInfo)
router.get('/', deviceController.getAll)
router.get('/:id', deviceController.getOne)
router.put('/', checkRole('ADMIN'), deviceController.put)

module.exports = router