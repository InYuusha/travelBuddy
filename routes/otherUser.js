const express = require('express')
const router = express.Router()

const {getOneProfile} = require('../db/index')

function isAnotherUser(req,res,next){
    req.anotherUser = true
    next()
}

//routes
router.get('/:auid',getOneProfile,isAnotherUser,getOneProfile,(req,res)=>{
    res.render('otherUser',{otherUser:req.anotherUserInfo,user:req.userinfo})
})

module.exports = router