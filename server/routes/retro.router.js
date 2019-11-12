const express = require('express');

const RetroCtrl = require('../controllers/retro.controller');

const router = express.Router();

router.post('/retro', RetroCtrl.createRetro);
router.get('/retro/:id', RetroCtrl.getRetroById);
router.get('/retros/:userId', RetroCtrl.getRetros);
router.put('/retro/:id', RetroCtrl.updateRetro);
router.delete('/retro/:id', RetroCtrl.deleteRetro);

module.exports = router;