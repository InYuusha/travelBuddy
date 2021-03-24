const express = require('express')
const router = express.Router()
const {addOne} = require('../db/index')

//routes 

//get add-post route
router.get('/addPost',(req,res)=>{
    res.render('addPost',{user:req.userinfo})
})

// post to add-post route
router.post('/addPost',addOne,(req,res)=>{ 
    let uid = (req.userinfo.user_username?req.userinfo.user_username:req.user.username)
    res.redirect(`/user/${uid}/posts`)
})


//exports
module.exports = router;