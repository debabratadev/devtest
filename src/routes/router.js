const express = require('express');
const controller = require('../controllers/controller')
const router = express.Router();
router.get('/v1/insert-users',controller.getUsers);
router.get('/v1/puppeteer',controller.fetchDataFromWebsite);

module.exports = router;