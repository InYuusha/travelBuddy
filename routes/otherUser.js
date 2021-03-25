const express = require('express')
const router = express.Router()

const {getOneProfile,getAllPosts} = require('../db/index')
const {getTimeDiff} = require('../controllers/postOp')

function isAnotherUser(req,res,next){
    req.anotherUser = true
    next()
}

//routes
router.get('/:auid',getOneProfile,isAnotherUser,getOneProfile,getAllPosts,getTimeDiff,(req,res)=>{
    res.render('otherUser',{otherUser:req.anotherUserInfo,user:req.userinfo,posts:req.posts})
})

module.exports = router