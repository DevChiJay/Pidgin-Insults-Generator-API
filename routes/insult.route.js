const express = require('express');

const insultController = require('../controllers/insults.controller');

const router = express.Router();

router.get('/', insultController.getAllNew);

router.get('/random', insultController.getRandomInsult);

router.post('/new/add-insult', insultController.addInsult);

router.post('/store/:key', insultController.saveInsult);

router.delete('/delete/pending', insultController.removePendingInsults);

module.exports = router;
