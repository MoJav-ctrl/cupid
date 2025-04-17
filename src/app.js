const express = require('express')

const authRouter = require('../src/routes/userRoutes')
const loveRequestRouter = require('../src/routes/loveRequestRoutes')
const appRouter = express()

appRouter.use('/api', authRouter)
appRouter.use('/api/love', loveRequestRouter)

module.exports = appRouter