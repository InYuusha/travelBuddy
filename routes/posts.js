const express = require('express')
const router = express.Router()
const {getOneProfile,addOne} = require('../db/index')

//routes 
router.get('/addPost',(req,res)=>{
    res.render('addPost')
})

router.post('/addPost',getOneProfile,addOne,(req,res)=>{
    res.redirect(`/user/${req.user.username}/posts`)
})


//exports
module.exports = router;