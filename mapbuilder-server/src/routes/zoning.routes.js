const express = require('express');
const zoningController = require('../controllers/zoning.controller');

const router = express.Router();

// Get zoning by parcel ID
router.get('/parcel/:id', zoningController.getZoningByParcelId);

module.exports = router;