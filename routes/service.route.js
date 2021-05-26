var express = require('express');
var router = express.Router();
var multer  = require('multer');
var controller = require('../controller/service.controller');

var upload = multer({ dest: './public/uploads/' });
router.get('/',controller.index)

router.post('/serviceCreate',
  upload.single('img'),
  controller.serviceCreate
);

router.put('/updateService/:id',
  upload.single('img'),
  controller.updateService
);

router.delete('/deleteService/:id',
  controller.deleteService
);


module.exports = router;
