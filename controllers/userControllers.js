const models = require('../models');
//const User = require('../models').User;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//this is a POST request 
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

//this is a POST request 
const userLogin = (req, res)=>{
    const { email, password } = req.body;

    models.User.findOne({where:{email:email }}).then(user =>{
        if(!user){
            console.log("Email does not exists in DB");
            res.status(401).json({
                message: "Could not login, check your credentials"
            })
        }else{
            //email exists, now compare the password the password we recieved throug the body VS 
            //the un-hashed password from the DB corrspondes with this email. 
            bcrypt.compare(password, user.password, function(err, result){
                if(result){ //if they match
                    //provide the user a Token which includes a payload with data from the DB, a secret and an exp date: 
                    //HMAC SHA256 decoding algorithem
                    const token = jwt.sign({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: user.password
                        },
                        process.env.JWT_SECRET,
                        {expiresIn:'30d'}
                    );
                    //provide the user with the token
                    res.status(200).json({
                        token: token
                    })

                }else{
                    console.log("password is wrong!");
                    res.status(400).json({
                        message: "Could not login, check your credentials"
                    })

                }
            })
        }
    }).catch(error =>{
        console.error(error);
        res.status(500).json({
            message: "Something went wrong..."
        })
    });

}

//this is a GET request to the protected route: api/users/profile
//return a specific user data.
const getUserProfile = async (req,res)=>{
  
    //in authMiddleware.js we store all user data that's passed the authentication and authorization proccess in req.userData 
    const user = await models.User.findOne({where: {id: req.userData.id}})  // req.userData.id refers to the logged in user
   
   if(user){
     res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password
     })
   }else{
    
       res.status(404).json({
            message:'user not found'
       })
   }
 
 }


//this is a PUT request to the protected route: api/users/profile
//enables edit the specific user's data.
const updateUserProfile = async (req,res)=>{
  
   //in authMiddleware.js we store all user data that's passed the authentication and authorization proccess in req.user (excluding his password)
   const user = await models.User.findOne({where: {id: req.userData.id}})// req.userData.id refers to the logged in user
   
   if(user){
         user.name = req.body.name || user.name
         user.email = req.body.email || user.email
         if(req.body.password){
            //hash the password before adding the user to the DB
            const salt = bcrypt.genSaltSync(10);
            user.password = bcrypt.hashSync(req.body.password, salt); 

         }

         try{

             const updatedUser = await models.User.update( {
                id: user.id,
                name: user.name,
                email:  user.email,
                password: user.password
                }, 
                 {where: {id: req.userData.id}}
               );
              //generate a token with the new data! and we will send it to the user! in the response
               const token = jwt.sign({
                 id: user.id,
                 name: user.name,
                 email: user.email,
                 password: user.password
                 },
                 process.env.JWT_SECRET,
                 {expiresIn:'30d'}
             ); 
              //send the new data back plus the token
               res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                token: token
              })
         }catch(error){
            res.status(500).json({
                message: 'could not update user'
            })
         }

  
   }else{
       res.status(404).json({
           message: 'user not found'
       })
       
   }
 
 }



module.exports = {
    registerUser: registerUser,
    userLogin: userLogin,
    getUserProfile: getUserProfile,
    updateUserProfile : updateUserProfile

}