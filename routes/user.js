const express  = require('express')
const router = express.Router()
const {getOne} = require('../db/index')

//check if the user is authenticated
function isAuth(req,res,next){
    if(req.user){
        next()

    }
    else{
        req.flash('error',"Login required")
        res.redirect('/users/login')
    }
}

//routes
//@ dashboard route
router.get('/:uid',isAuth,getOne)


//exports
module.exports = router