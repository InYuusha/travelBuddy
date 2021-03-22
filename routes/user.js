const express  = require('express')
const router = express.Router()
const {getOne,postOne,getOneProfile,removeUserInfo, getAllPosts, getLimitedPosts} = require('../db/index')
const {removeUserCred} = require('../controllers/UserOp')
const {check, validationResult} = require('express-validator')

//sanitise parameteres

var sanitise =[
    check('name').isString().withMessage("Choose a better name").isLength({min:4}).withMessage("Name too short"),
    check('age').escape().isNumeric(),
    check('bio').escape().isString().withMessage("Dont spam the description").isLength({min:10}).withMessage("Too short description"),
    check('location').escape().isString().withMessage("Invalid location")
    
]

function validate(req,res,next){
    let {name,age,bio,location} = req.body
    let errors =[];
    // check if all info is provided
    if(!name||!age||!bio||!location){
        errors.push("Please fill all the details")
        
    }
    if(age<9){
        errors.push("Minimum age is 9")

    }

    //finally if "errors" is populated
    if(errors.length>0){
        res.redirect(`/user/${req.user.username}?err=${errors[0]}`)
    }
    else{
        valErr = validationResult(req)
        if(valErr.errors.length>0){
            res.redirect(`/user/${req.user.username}?err=${valErr.errors[0].msg}`)
        }
        else{
            next() 
        }
    }
}

//check if the user is authenticated
router.use((req,res,next)=>{
    if(req.user){
        res.locals.userCred = req.user;

        next()

    }
    else{
        req.flash('error',"Login required")
        res.redirect('/users/login')
        
    }
})
// has registred to userinfo 
function hasUserInfo(req,res,next){
    if(req.userinfo){
        next()
    }
    else{
        let uid = (req.user.username?req.user.username:req.params.uid)
        res.redirect(`/user/${uid}/`)
    }
}
//render create user if userinfo not found
function createUser(req,res,next){

         //if userinfo doesnt exist ask user for basic info
         if(!req.userinfo){
            res.render('createUser',{error:req.query.err})
        }
        //if userinfo exist show user home page
        else{
            next()
        }

}

//routes
//@ home page route
router.get('/:uid',getOneProfile,createUser,getLimitedPosts,(req,res)=>{

    res.render('Home',{user:req.userinfo,posts:req.posts})
 
})

//create-user route
router.post('/:uid',sanitise,validate,postOne)

//user-profile route
router.get('/:uid/profile',getOneProfile,hasUserInfo,(req,res)=>{
   
    res.render('profile',{user:req.userinfo})
})

//delete user account
router.get('/:uid/profile/delete',getOneProfile,hasUserInfo,removeUserInfo,removeUserCred)

//get user posts
router.get('/:uid/posts',getOneProfile,hasUserInfo,getAllPosts,(req,res)=>{
    
    
    res.render('post',{user:req.userinfo,posts:req.posts})
})

//routes for handling user posts
router.use('/:uid/posts',getOneProfile,hasUserInfo,require('./posts'))

//exports
module.exports = router