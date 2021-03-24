const express = require('express')
const passport = require('passport')
const path = require('path')
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

/* ------------- Some Middlewares -----------*/

//bodyParser
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

//disable caching
app.use((req,res,next)=>{
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
})

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



//@ Login Register routes
//@desc : routes for handling login registeration
app.use('/', require('./routes/home.js'))

//protected route
app.use('/user',require('./routes/user.js'))

/*Auth routes
@desc: user login
       user logout
 */
app.use('/users', require('./routes/auth.js'));





const port = process.env.PORT||5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})