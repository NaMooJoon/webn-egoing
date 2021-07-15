const { Router } = require('express');
const router = Router();
const userController = require('../controllers/user');

router.get('/', userController.getUser);
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);
router.post('/signup', userController.signUp);

module.exports = router;
