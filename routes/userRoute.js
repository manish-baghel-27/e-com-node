const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/get-all-users').get(
    userController.getAllUsers
);

router.route('/updatepassword').patch(
    authController.protect, 
    userController.updatePassword
);

router.route('/update-profile').patch(
    authController.protect, 
    userController.updateProfile
);

router.route('/delete-user').delete(
    authController.protect, 
    userController.deleteUser
);

module.exports = router;