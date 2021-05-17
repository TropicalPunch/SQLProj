  
const express = require ('express');

const router = express.Router()// api/users/

const { registerUser } = require ('../controllers/userControllers.js'); 

router.route('/register').post(registerUser);

module.exports = router;