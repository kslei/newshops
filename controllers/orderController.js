const { OrderDevice, Order, User, Device, Brand, Delivery } = require('../models/models')
const ApiError = require('../error/ApiError')

class OrderController {
  async create(req, res) {
    try {
      const { deviceId, userId } = req.body
      const status = "NEW"
      const order = await Order.findOrCreate({ attributes: ['id'], where: { userId, status } })
      const orderId = order[0].id
      const orderDevice = await OrderDevice.create({ deviceId, orderId })
      return res.json(orderDevice)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async get(req, res, next) {
    const { userId, status } = req.query
    console.log('status', status)
    let data
    if (userId) {
      data = await Order.findOrCreate({ where: { userId, status }, include: [{ model: OrderDevice, attributes: ['id'], include: [{ model: Device, attributes: ['id', 'name', 'price', 'rating', 'img'], include: [{ model: Brand, attributes: ['name'] }] }] }] })
    }
    if (!userId) {
      data = await Order.findAll({ where: { status }, include: [{ model: OrderDevice, attributes: ['id'], include: [{ model: Device, attributes: ['id', 'name', 'price', 'rating', 'img'], include: [{ model: Brand, attributes: ['name'] }] }] }, { model: User, attributes: ['email', 'name', 'phone'] }, {model: Delivery, attributes: ['name']}] })
    }
    console.log('data', data)
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

  async delete(req, res) {
    const { userId, deviceId } = req.query
    const status = "NEW"
    const order = await Order.findAll({ attributes: ['id'], where: { userId, status } })
    console.log(order)
    const orderId = order[0].id
    const data = await OrderDevice.destroy({ where: { orderId, deviceId } })
    return res.json(data)
  }

}

module.exports = new OrderController()