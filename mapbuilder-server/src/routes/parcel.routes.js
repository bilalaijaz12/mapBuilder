const express = require('express');
const parcelController = require('../controllers/parcel.controller');

const router = express.Router();

// Existing route
router.post('/geometry', parcelController.getParcelByGeometry);

// New route
router.get('/address', parcelController.getParcelByAddress);

module.exports = router;