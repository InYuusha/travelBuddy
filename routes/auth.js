const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

const {check , validationResult} = require('express-validator')

// sanitise parameteres
var sanitise =[
    check('name').escape(),
    check('username').trim().escape(),
    
]
//check if the user is authenticated
function isAuth(req,res,next){
    if(req.user){
       let uid = req.user.username
        res.redirect(`/user/${uid}`)
        
    }
    else{
        next()
    }
}

//user model
const User = require('../models/User.js')

router.get('/login',isAuth,(req,res)=>{
    res.render('login')

})


router.get('/register',[
    
],isAuth,(req,res)=>{
    res.render('register')
})

router.post('/register',sanitise,(req,res)=>{
   const {name,username,password,password2}=req.body;
   let errors=[];
   
   //checking for required fileds
   if(!name||!username||!password||!password2){
       errors.push({msg:'Please fill in all the fields'})
   }
   //check for password match
   if(password!==password2){
       errors.push({msg:'Password do not match'})
   }
   if(username.length<3){
       errors.push({msg:'Username too short!'})
   }
   if(name.length<4){
       errors.push({msg:'Name too short! , try using your full name'})
   }
   // check for pass length
   if(password.length<6){
       errors.push({msg:'Password too short'})
   }
   if(errors.length >0)
   res.render('register',{
       errors,
       name,
       username
   })
   else{
      User.findOne({username:username})
      .then(user=>{
          //if username already exists
          if(user){
              errors.push({msg:'Username already exists'});
              res.render('register',{
                  errors,
                  name,
                  username
              })
          }
          else{
              const newUser = new User({
                  name:name,
                  username:username,
                  password:password
              })
              //hashing and salting pass
              bcrypt.genSalt(10,(err,salt)=>{
                  bcrypt.hash(newUser.password,salt,(err,hash)=>{
                      if(err) throw err;
                      //set password to hash
                      newUser.password=hash;
                      //save new User
                      newUser.save()
                      .then(user=>{
                          req.flash("success_msg","User Registered Successfully")
                          res.redirect('/users/login')
                      })
                      .catch(err=>console.log(err))
                  })
              })
          }
      })
   }
})
router.post('/login',sanitise,(req,res,next)=>{
    let user = req.body.username
    passport.authenticate('local',{
        successRedirect:`/user/${user}`,
        failureRedirect:'/users/login',
        failureFlash:true
    })
    (req,res,next);
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out successfully')
    res.redirect('/users/login')
})



module.exports = router;
