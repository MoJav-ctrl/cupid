const express = require('express');
const { getAllUsers, getUserById, signUp, verifyAccount, resendVerificationCode, login, deleteUser} = require('../controllers/userController');
const authMiddleware = require('../auth/authMiddleware');
const userRouter = express.Router();

userRouter.get('/users', authMiddleware, getAllUsers)
userRouter.get('/users/:id', authMiddleware, getUserById)
userRouter.post('/users/sign-up', signUp);
userRouter.post('/users/verify-account', verifyAccount);
userRouter.post('/users/resend-verification-code', resendVerificationCode);
userRouter.post('/users/login', login);
userRouter.post('/users/delete/:id', authMiddleware, deleteUser)



module.exports = userRouter;