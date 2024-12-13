const express = require('express');
const router = express.Router();
const categoryController = require('./../controllers/categoryController');
// const authController = require('./../controllers/authController');

// file upload
const multer = require('multer');
const upload = multer({
//    dest: 'files/', // Location where files will be saved
});

router.route('/')
    .get(categoryController.getAllCategories)
    .post(upload.any(), categoryController.createCategory)

router.route('/:id')
.get(categoryController.getCategory)
.patch(categoryController.updateCategory)
.delete(categoryController.deleteCategory)

module.exports = router;