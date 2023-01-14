const ApiError = require('../error/ApiError');
const { Rating } = require('../models/models');
//const router = require('../routes/ratingRouter');
const deviceController = require('./deviceController');

class RatingController {
  async create(req, res, next) {
    let {rate, userId, deviceId} = req.body
    if (!userId) {
      return next(ApiError.badRequest("Войдите в свою учетную запись или зарегистрируйтесь"))
    }
    let grade = await Rating.findOne({ where: { userId, deviceId } })
    console.log(grade)
    if (grade) {
      return next(ApiError.badRequest('Вы уже ставили оценку'))
    }
    await Rating.create({rate, userId, deviceId})

    let deviceRate = (await Rating.findAll({ attributes: ['rate'], where: { deviceId } })).map(item => Number(item['rate']))
    console.log("deviceRate", deviceRate)
    const ratings = (deviceRate.reduce((sum, item) => sum = sum + item, 0)) / deviceRate.length
    //return res.json(ratings)
    return deviceController.update(
      req = {
        id: deviceId,
        rating: ratings
      },
      res
    )
  }

  async getOne(req, res, next) {
    let {deviceId} = req.query
    
    let deviceRate = (await Rating.findAll({ attributes: ['rate'], where: { deviceId } })).map(item => Number(item['rate']))
    console.log("deviceRate", deviceRate)
    const ratings = (deviceRate.reduce((sum, item) => sum = sum + item, 0))/deviceRate.length
    return deviceController.update(
      req = {
        id: deviceId,
        rating: ratings
      },
      res
    )
  }
}
module.exports = new RatingController()