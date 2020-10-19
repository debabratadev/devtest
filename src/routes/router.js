const express = require('express');
const controller = require('../controllers/controller')
const router = express.Router();
router.get('/v1/insert-users',controller.getUsers);

module.exports = router;