const express = require('express');
const router = express.Router();
const TagController = require('./../controllers/TagsController');
// const authController = require('./../controllers/authController');

router.route('/')
    .get(TagController.getTags)
    .post(TagController.createTag)

router.route('/:id')
.patch(TagController.updateTag)
.delete(TagController.deleteTag)

module.exports = router;