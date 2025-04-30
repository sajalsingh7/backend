const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controller');
const { authenticate } = require('../middlewares/auth'); 

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);

// router.delete('/delete', authenticate, userController.deleteUser); //TODO

module.exports = router;