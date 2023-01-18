const uuid = require('uuid')
const path = require('path')
const {Type} = require('../models/models')
const ApiError = require('../error/ApiError');

class TypeController {
  async create(req, res) {
    const {name} = req.body
    const { img } = req.files
    let fileName = uuid.v4() + ".jpg"
    img.mv(path.resolve(__dirname, '..', 'static', fileName))
    const type = await Type.create({ name, img: fileName })
    return res.json(type)
  }

  async getAll(req, res) {
    const types = await Type.findAll({order: ['id']})
    return res.json(types) 
  }

}

module.exports = new TypeController()