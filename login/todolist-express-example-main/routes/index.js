const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const todoRouter = require('./todolist');

router.use('/user', userRouter);
router.use('/todolist', todoRouter);

module.exports = router;
