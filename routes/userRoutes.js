  
const express = require ('express');

const router = express.Router()// api/users/

const { registerUser, userLogin} = require ('../controllers/userControllers.js'); 

router.route('/register').post(registerUser);

router.route('/login').post(userLogin)

module.exports = router;