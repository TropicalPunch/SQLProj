  
import express from 'express'

const router = express.Router()// api/users/

const { registerUser } = require ('../controllers/userControllers.js'); 

router.route('/').post(registerUser);