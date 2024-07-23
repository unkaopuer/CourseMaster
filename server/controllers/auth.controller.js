const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

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
            return res.status(401).send({
                error:"Email and password don't match"
            })
        }
        





    } catch(err){
        return res.status(401).json({
            error:"Could not sign in"
        })
    }
}