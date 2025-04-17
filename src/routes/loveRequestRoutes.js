const express = require('express');
const { sendLoveRequest, respondToLoveRequest } = require('../controllers/loveRequestController')
const authMiddleware = require('../auth/authMiddleware')

const loveRequestRouter = express.Router()


loveRequestRouter.post('/send-love-request', authMiddleware, sendLoveRequest)
loveRequestRouter.post('/respond-love-request', authMiddleware, respondToLoveRequest)

module.exports = loveRequestRouter;