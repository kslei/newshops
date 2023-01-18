const { OrderDevice, Order, User, Device, Brand, Delivery } = require('../models/models')
const ApiError = require('../error/ApiError')

class OrderController {
  async create(req, res) {
    try {
      let resp = []
      const { deviceId, userId, date, deliveryId } = req.body
      const status = "В обработке"
      const order = await Order.findOrCreate({ attributes: ['id'], where: { userId, status, date, deliveryId } })
      const orderId = order[0].id
      for (let i=0; i<deviceId.length; i++) {
        const orderDevice = await OrderDevice.create({ deviceId: deviceId[i], orderId })
        resp.push(orderDevice)
      }
      return res.json(resp)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async get(req, res, next) {
    const { status } = req.query
    const data = await Order.findAll({ where: { status }, include: [{ model: OrderDevice, attributes: ['id'], include: [{ model: Device, attributes: ['id', 'name', 'price', 'rating', 'img'], include: [{ model: Brand, attributes: ['name'] }] }] }, { model: User, attributes: ['email', 'name', 'phone'] }, {model: Delivery, attributes: ['name']}] })
    if (data.length === 0) {
      return next(ApiError.badRequest("Нет заказов"))
    }
    if (data[0].order_devices.length === 0) {
      return next(ApiError.badRequest("Нет товаров в корзине"))
    }
    return res.json(data)
  }

  async putOrder(req, res) {
    const { id, status, date, deliveryId } = req.body
    const orderStatus = await Order.update({ status: status, date: date, deliveryId: deliveryId }, { where: { id } })
    return res.json(orderStatus)
  }
  
}

module.exports = new OrderController()