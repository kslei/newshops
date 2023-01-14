const { Delivery } = require('../models/models')
const ApiError = require('../error/ApiError');

class DeliveryController {
  async create(req, res) {
    const { name } = req.body
    const delivery = await Delivery.create({ name })
    return res.json(delivery)
  }

  async getAll(req, res) {
    const deliveries = await Delivery.findAll()
    return res.json(deliveries)
  }

  async remove(req, res) {
    const {id} = req.query
    const data = await Delivery.destroy({id})
    return data
  }
}

module.exports = new DeliveryController()