const express = require('express');
const structuresController = require('../controllers/structures.controller');

const router = express.Router();

// Get structures on a parcel
router.get('/parcel/:id', structuresController.getStructuresByParcelId);

module.exports = router;