const User = require('../models/user');
//models.User.create(newUser) for registration

const registerUser = async (req, res)=>{
    const {email, password, name} = req.body;
    //if userexists in DB...
     const userExists = await User.findOne({email: email})
    
    if(userExists){
         res.status(400)
         throw new Error('Cannot register, email exists in DB')
    }

    //else create it in the DB!

    const newUser = await User.create({
        name,
        email,
        password
    })

    if(newUser){
        res.ststus(201).json({
            //_id: user._id,
            name: user.name,
            email: user.email,
            //token: generateToken(user._id) 
        })
    }else{
        res.status(400)
        throw new Error('User could not be created- invalid data')
    }

}

module.exports = {
    registerUser
}