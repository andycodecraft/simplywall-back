const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouse.controller');

router.get('/warehouses/', warehouseController.getWarehouses);
router.post('/warehouse/', warehouseController.createWarehouse);
router.get('/warehouse/:id', warehouseController.getWarehouseById);
router.put('/warehouses/', warehouseController.updateWarehouses);
router.delete('/warehouse/:id', warehouseController.deleteWarehouse);

module.exports = router;