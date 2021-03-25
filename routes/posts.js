const express = require('express')
const router = express.Router()
const {addOne, removeOnePosts} = require('../db/index')

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

/* Delete one posts*/
router.get('/:pid/delete',removeOnePosts,(req,res)=>{
    res.redirect(`/user/${req.user.username}/posts`)
})


//exports
module.exports = router;