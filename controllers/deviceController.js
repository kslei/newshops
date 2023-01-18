const uuid = require('uuid')
const path = require('path')
const {Device, DeviceInfo, Brand, Type} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviceController {
  async create(req, res, next) {
    try {
      let {name, price, brandId, typeId, number, info} = req.body
      const {img} = req.files
      let fileName = uuid.v4() + ".jpg"//v4 сгенерирует id
      img.mv(path.resolve(__dirname, '..', 'static', fileName))//переместить файлы
      const device = await Device.create({ name, price, brandId, typeId, number, img: fileName })
      if (info) {
        info = JSON.parse(info)
        info.forEach(i =>
          DeviceInfo.create({
            title: i.title,
            description: i.description, 
            deviceId: device.id
          })
        )
      }
      
      return res.json(device)
    } catch(e) {
        next(ApiError.badRequest(e.message))
    }
  }

  async createInfo(req, res, next) {
    try {
      let {deviceId, title, description} = req.body
      const info = await DeviceInfo.create({deviceId, title, description})
      return res.json(info)
    } catch (e) {
      next(ApiError.badRequest(e.message)) 
    }
  }

  async put(req, res, next) {
    try {
      let { id, name, price, brandId, typeId, number, info } = req.body
      let device;
      if(req.files) {
        const { img } = req.files      
        let fileName = uuid.v4() + ".jpg"
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
        device = await Device.update({ name, price, brandId, typeId, number, img: fileName }, { where: { id } })
      } else {
        device = await Device.update({ name, price, brandId, typeId, number }, { where: { id } })
      }
      
      if (info) {
        info = JSON.parse(info)
        info.forEach(i =>
          DeviceInfo.update({
            title: i.title,
            description: i.description,
          }, { where: { id: i.id }})
        )
      }

      return res.json(device)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async getAll(req, res) {
    let {brandId, typeId, limit, page} = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10;
    let offset = page * limit - limit
    let devices;
    if(!brandId && !typeId) {
      devices = await Device.findAndCountAll({ order: ['id'], limit, offset, include: [{ model: Brand, attributes: ['name', 'id'] }, { model: Type, attributes: ['name', 'id']}] })
    }
    if(brandId && !typeId) {
      devices = await Device.findAndCountAll({ order: ['id'], where: { brandId }, limit, offset, include: [{ model: Brand, attributes: ['name', 'id'] }, { model: Type, attributes: ['name', 'id'] }] })
    }
    if(!brandId && typeId) {
      devices = await Device.findAndCountAll({ order: ['id'], where: { typeId }, limit, offset, include: [{ model: Brand, attributes: ['name', 'id'] }, { model: Type, attributes: ['name', 'id'] }] })
    }
    if(brandId && typeId) {
      devices = await Device.findAndCountAll({ order: ['id'], where: { brandId, typeId }, limit, offset, include: [{ model: Brand, attributes: ['name', 'id'] }, { model: Type, attributes: ['name', 'id'] }] })
    }
    return res.json(devices)
  }

  async getOne(req, res) {
    const {id} = req.params
    const device = await Device.findOne(
      {
        where: {id},
        include: [{ model: DeviceInfo, as: 'info' }, { model: Brand, attributes: ['name'] }]
      },
    )
    return res.json(device)
  }

  async update(req, res) {
    const id = req.id
    const rating = req.rating
    const device = await Device.findOne(
      {
        where: {id}
      }
    )
    await device.update({ rating: rating })
    return res.json(device)
  }
}

module.exports = new DeviceController()