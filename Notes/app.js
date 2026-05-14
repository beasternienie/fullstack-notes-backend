const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const notesRouter = require('./controllers/notes')

const app = express()

logger.info('Connecting to the database...')

mongoose
    .connect(config.DB_URI, { family: 4 })
    .then(() => {
        logger.info('Connected to the database.')
    })
    .catch((error) => {
        logger.error('Error connecting to database:', error.message)
    })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app