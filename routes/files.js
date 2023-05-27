const express = require('express');
const router = express.Router();
const fileController = require('../controllers/home_controller')


router.post('/upload' , fileController.uploadFile)


router.get('/filecsv' , fileController.showFile)

router.get('/deleteFile/:id',fileController.deleteFile)


module.exports = router;