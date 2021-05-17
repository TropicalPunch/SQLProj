const models = require('../models');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




const registerUser = async (req, res)=>{
    
    const {name, email, password} = req.body;
    
    //if userexists in DB...
    models.User.findOne({ where: { email: email } }).then( result =>{
        if(result){ //if user exists in db
            res.status(409).json({
                massage:'Cannot register, email exists in DB'
            });
               
        }else{ //user does not exists in db , proceed ...

            const newUser = {
                name,
                email,
                password
            };
        
            //hash the password before adding the user to the DB
            const salt = bcrypt.genSaltSync(10);
            newUser.password =  bcrypt.hashSync(password, salt); 
            
            //email does not exists in the db, we shall now create it!
            models.User.create(newUser).then(result => {
                res.status(201).json({
                   message: 'user created!' 
                })
            }).catch(error =>{
                res.status(400).json({
                    message: 'User could not be created- invalid data'
                })
            })
        
        }
        }).catch(error => {
            res.status(500).json({
                message: 'Cannot register, internal server error'
            })
        })

}

module.exports = {
    registerUser: registerUser,
}