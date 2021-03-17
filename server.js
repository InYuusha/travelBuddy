const express = require('express')
const passport = require('passport')
const expressLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

const app = express();

require('dotenv').config()
//passport config
require('./config/passport')(passport)

//mongoose
const url = process.env.MONGO_URL
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology: true })
.then(()=>console.log(`Server connected to the database`))
.catch(err=>console.log(err))

//bodyParser
app.use(express.urlencoded({extended:true}))

//express session
app.use(session({
    secret:process.env.SECRET,
    resave:true,
    saveUninitialized:true

}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//connect flash
app.use(flash())

//global var
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error = req.flash('error');
    next()
})

//ejs
app.set('view engine','ejs')
app.use(expressLayout)

//check if the user is authenticated
function isAuth(req,res,next){
    if(req.user){
        next()

    }
    else{
        req.flash('error',"Dont try to be smart")
        res.redirect('/users/login')
    }
}

//routes
app.use('/', require('./routes/home.js'))
//protected route
app.get('/dashboard',isAuth,(req,res)=>{
    res.render('dashboard')
})
//login logout
app.use('/users', require('./routes/routes.js'));



const port = process.env.PORT||3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})