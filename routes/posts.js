const express = require('express')
const router = express.Router()

//routes 
router.get('/addPost',(req,res)=>{
    res.render('addPost')
})

router.post('/addPost',(req,res)=>{
    console.log(req.body)
})


//exports
module.exports = router;