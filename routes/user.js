const express  = require('express')
const router = express.Router()
const {getOne,postOne,getOneProfile} = require('../db/index')
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
//@ home page route
router.get('/:uid',isAuth,getOne)

//create user route
router.post('/:uid',isAuth,sanitise,validate,postOne)

//user profile route
router.get('/:uid/profile',isAuth,getOneProfile)



//exports
module.exports = router