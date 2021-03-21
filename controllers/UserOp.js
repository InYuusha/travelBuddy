const User = require('../models/User')


exports.removeUserCred = async function(req,res){
    let uid = req.user.username;
    await User.findOneAndDelete({username:uid})
    .then(result=>{
        req.flash('success_msg',"User has been deleted")
        res.redirect('/users/login')
    })

}