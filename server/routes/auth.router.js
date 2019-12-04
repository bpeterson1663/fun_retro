const express = require('express');

const AuthCtrl = require('../controllers/auth.controller.js');
const router = express.Router();

router.post('/signup', AuthCtrl.createUser);
router.post('/login', AuthCtrl.createSession);
router.get('/login', AuthCtrl.getSession);
router.post('/logout', AuthCtrl.deleteSession);

module.exports = router;