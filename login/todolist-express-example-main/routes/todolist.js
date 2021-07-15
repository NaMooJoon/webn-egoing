const { Router } = require('express');
const router = Router();
const todolistController = require('../controllers/todolist');

router.get('/', todolistController.getList);
router.post('/create', todolistController.createItem);
router.post('/update', todolistController.updateItem);
router.post('/delete', todolistController.deleteItem);

module.exports = router;
