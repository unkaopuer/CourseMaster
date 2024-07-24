const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const {expressjwt: expressJwt} = require('express-jwt')
require('dotenv').config()

const signin = async (req, res) =>{
    try{
        let user = await User.findOne({
            "email": req.body.email
        })
        if(!user)
            return res.status(401).json({
                error: "User not found"
        })
       
        if(!user.authenticate(req.body.password)){
            return res.status(401).json({
                error:"Email and password don't match."
            })
        }

        const token = jwt.sign(
            {_id:user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1h'}
        )
        

        res.cookie('t',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + 3600000) 
        })


        return res.json({
            token,
            user:{
                _id: user._id,
                username: user.name,
                email: user.email,
                educator: user.educator
            }
        })
    } catch(err){
        return res.status(401).json({
            error:"Could not sign in"
        })
    }
}



const signout = (req,res) =>{
    res.clearCookie("t")
    return res.status(200).json({
        message:"signed out"
    })
}

const requireSignin = expressJwt({
    secret: process.env.ACCESS_TOKEN_SECRET,
    userProperty: 'auth',
    algorithms: ['HS256']
})

const hasAuthorization = (req,res,next)=>{
    const authorized = req.profile && req.auth && req.profile._id == req.auth._id
    if(!authorized){
        return res.status(403).json({
            error: "User is not authorized"
        })
    }
    next()
}

module.exports = {
    signin,
    signout,
    requireSignin,
    hasAuthorization
}