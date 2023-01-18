require('dotenv').config
const nodemailer = require('nodemailer');
const ApiError = require('../error/ApiError');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

class MailController {
  async post (req, res) {
    const {email, message} = req.body
    const mailOptions = {
      from: 'mystoretesting0408@gmail.com',
      to: email,
      subject: 'Заказ',
      text: message
    }
    const data = await transporter.sendMail(mailOptions, )
    return res.json(data)
  }

}

module.exports = new MailController()