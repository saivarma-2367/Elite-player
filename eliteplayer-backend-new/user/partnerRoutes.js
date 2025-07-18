const express = require('express');
const router = express.Router();
const partnerController = require('./partnerController');
router.get('/test', (req, res) => {
  res.json({ message: 'Partner routes working!' });
});

router.post('/', partnerController.createPartner);

module.exports = router;
