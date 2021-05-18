  
const express = require ('express');


const router = express.Router()// api/users/

const { registerUser, userLogin} = require ('../controllers/userControllers.js'); 
const {protect} = require('../middleware/authMiddleware.js')  //routes protecting middleware

router.route('/register').post(registerUser);

router.route('/login').post(userLogin);

router.route('/profile').get(protect, getUserProfile).put(protect,updateUserProfile) //these routes can be accessed only if user is authenticated!

module.exports = router;