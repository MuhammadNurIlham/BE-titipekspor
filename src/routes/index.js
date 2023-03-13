const express = require('express');

const router = express.Router();

// controller
const { register, login, checkAuth } = require('../controllers/authController'); // auth controller
const { addUser, getUser, getUsers, updateUser, deleteUser } = require('../controllers/userController'); // user Controller
const { getProfile } = require('../controllers/profileController'); // profile controller
const { addMembership, getMembership, getMemberships, updateMembership, deleteMembership } = require('../controllers/membershipController'); // membership controller
const { getTransactions, addTransaction } = require('../controllers/transactionController'); // transaction controller
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categoryController'); // category controller

// middleware
const { authMiddleware } = require('../middlewares/authMiddleware');


// router for auth (register, login, check auth)
router.post('/register', register);
router.post('/login', login);
router.get('/check-auth', authMiddleware, checkAuth)

// router for user
router.post('/user', addUser); // add user
router.get('/users', authMiddleware, getUsers); // get all user
router.get('/user/:id', getUser); // get user by id
router.patch('/user/:id', updateUser); // update user
router.delete('/user/:id', deleteUser); // delete user

// router for profile
router.get('/profile', authMiddleware, getProfile); // get profile by auth

// router for membership
router.get('/memberships', authMiddleware, getMemberships); // get all memberships
router.get('/membership/:id', authMiddleware, getMembership); // get membership by id
router.post('/membership', authMiddleware, addMembership); // add membership
router.patch('/membership/:id', authMiddleware, updateMembership); // update membership by id
router.delete('/membership/:id', authMiddleware, deleteMembership); // delete membership by id

// router for transaction
router.post('/transaction', authMiddleware, addTransaction); // add transaction
router.get('/transactions', authMiddleware, getTransactions); // get all transaction

// router for category
router.post('/category', authMiddleware, addCategory); // add category
router.get('/categories', authMiddleware, getCategories); // get all category
router.get('/category/:id', authMiddleware, getCategory); // get category by id
router.patch('/category/:id', authMiddleware, updateCategory); // update category
router.delete('/category/:id', authMiddleware, deleteCategory); // delete category


module.exports = router