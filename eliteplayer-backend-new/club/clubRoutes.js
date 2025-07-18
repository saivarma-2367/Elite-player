const express = require('express');
const router = express.Router();
const clubController=require('./clubController');

router.get('/test', (req, res) => {
  res.json({ message: 'Club routes working!' });
});

router.post('/newclub',clubController.createClub);
router.post('/login',clubController.loginClub);

module.exports = router;