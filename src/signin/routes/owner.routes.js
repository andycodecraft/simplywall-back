const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/owner.controller');

router.get('/owners/', ownerController.getOwners);
router.post('/owner', ownerController.createOwner);
router.get('/owner/:id', ownerController.getOwnerById);
router.put('/owners/', ownerController.updateOwners);
router.delete('/owner/:id', ownerController.deleteOwner);

module.exports = router;