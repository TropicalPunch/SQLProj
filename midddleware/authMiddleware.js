const jwt = require ('jsonwebtoken');
const models = require('../models');

const protect = async (req,res,next) =>{
    //if the request headers doesn't include the proper data....
    if(req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')){
        try{
            const token = req.headers.authorization.split( ' ' )[1];   //we need to extract from the headers only the token string excluding the space and 'Bearer' so we will split the string at the space between the token and Bearer and take the secont part (the string).
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            //so now we can gain access to this user's id as it appears in the DB
            req.userData = await  models.User.findOne({ where: { id: decoded.id } }) //user data is stored in this variable!
            next() //passed the middleware access granted!
        }catch(error){
                    res.status(401).json({
                    message: 'Not authrized, token faild verification',
                    error: error
                    })
        }
    }else{
        res.status(401).json({
            message: 'faild verification'
            })
    }
    
}

module.exports = {
    protect: protect
}