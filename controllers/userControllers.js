const models = require('../models');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');




const registerUser = (req, res)=>{
    
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


const userLogin = (req, res)=>{
    const {name, email, password} = req.body;

    models.User.findOne({where:{email:email }}).then(user =>{
        if(!user){
            res.status(401).json({
                message: "Email does not exists in DB"
            })
        }else{
            //email exists, now compare the password the password we recieved throug the body VS 
            //the un-hashed password from the DB corrspondes with this email. 
            bcrypt.compare(password, user.password, function(err, result){
                if(result){ //if they match
                    //provide the user a Token which includes a payload with data from the DB, a secret and an exp date: 
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                        },
                        process.env.JWT_SECRET,
                        {expiresIn:'30d'}
                    );
                    //provide the user with the token
                    res.status(200).json({
                        token: token
                    })

                }else{
                    res.status(400).json({
                        message: "wrong password..."
                    })

                }
            })
        }
    }).catch(error =>{
        res.status(500).json({
            message: "Something went wrong..."
        })
    });

}



module.exports = {
    registerUser: registerUser,
    userLogin: userLogin 
}