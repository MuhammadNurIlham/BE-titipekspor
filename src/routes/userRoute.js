const express = require('express');

const router = express.Router();

const { addUser, getUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');

router.post('/user', addUser);
router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.patch('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

module.exports = router