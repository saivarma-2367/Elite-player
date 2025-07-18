const express = require('express');
const router = express.Router();
const userController = require('./user/userController.js');
const loginController=require('./user/loginController.js');
const partnerController=require('./user/partnerController.js');

router.get('/test', (req, res) => {
  res.json({ message: 'User routes working!' });
});

router.post('/register', userController.registerUser);
router.post('/login',loginController.loginUser);
router.post('/partner',partnerController.createPartner);

module.exports = router;
