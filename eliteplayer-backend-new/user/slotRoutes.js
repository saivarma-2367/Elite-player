const express = require('express');
const router = express.Router();
const slotController=require('./slotController');

router.get('/',slotController.getSlotsInfo);

router.post('/book',slotController.bookSlot);

module.exports = router;