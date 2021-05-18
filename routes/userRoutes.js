  
const express = require ('express');


const router = express.Router()// api/users/

const { registerUser, userLogin, getUserProfile, updateUserProfile} = require ('../controllers/userControllers.js'); 
const {authUser} = require('../middleware/authMiddleware.js')  //routes protecting middleware

router.route('/register').post(registerUser);

router.route('/login').post(userLogin);

router.route('/profile').get(authUser, getUserProfile).put(authUser,updateUserProfile) //these routes can be accessed only if user is authenticated!

module.exports = router;