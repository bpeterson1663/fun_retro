const express = require('express');

const RetroCtrl = require('../controllers/retro.controller');

const router = express.Router();

router.post('/retro', RetroCtrl.createRetro);
router.get('/retro/:id', RetroCtrl.getRetroById);
router.get('/retros', RetroCtrl.getRetros);

module.exports = router;