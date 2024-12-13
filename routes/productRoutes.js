const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');
// const authController = require('./../controllers/authController');
// file upload
const multer = require('multer');
const upload = multer({
//    dest: 'files/', // Location where files will be saved
});

router.route('/')
    .get(productController.getAllProducts)
    .post(upload.any(), productController.createProduct)

router.route('/:id')
.patch(productController.updateProduct)
.delete(productController.deleteProduct)

module.exports = router;