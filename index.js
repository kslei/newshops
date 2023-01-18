require ('dotenv').config()

const express = require('express')
const sequelize = require('./db')
const models = require('./models/models')
const cors = require('cors')//запросы из браузера
const fileupload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware.js')
const path = require('path')
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.options('*', cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'build')))
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileupload({}))
app.use('/api', router)
app.use(errorHandler)

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync(/* { alter: true } */) // для обновления БД при изменении модели
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()