const express = require('express');

const ItemCtrl = require('../controllers/item.controller');
const router = express.Router();

router.post('/item', ItemCtrl.createItem);
router.get('/item/:id', ItemCtrl.getItemById);
router.get('/retro/:id/items/:columnId', ItemCtrl.getItems);
router.put('/item/:id', ItemCtrl.updateItem);
router.delete('/item/:id', ItemCtrl.deleteItem);

module.exports = router;