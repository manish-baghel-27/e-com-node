const express = require('express');
const router = express.Router();
const postController = require('./../controllers/postController');
// const authController = require('./../controllers/authController');
// file upload
const multer = require('multer');
const upload = multer({
//    dest: 'files/', // Location where files will be saved
});

router.route('/')
    .get(postController.getAllPosts)
    .post(upload.any(), postController.createPost)

router.route('/:id')
.patch(postController.updatePost)
.delete(postController.deletePost)

module.exports = router;