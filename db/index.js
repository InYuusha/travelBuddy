const { Promise } = require('mongoose')
const mysql = require('mysql')

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"*Ankush*",
    database:"user"

})


//if user info exist for current user-->home else-->createuser
exports.getOne = function(req,res){
    if(!req.user){
        res.redirect('/users/login')
    }
    else{
       
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let username = req.params.uid;
        let query = `SELECT * FROM userinfo WHERE user_username='${username}'`
        conn.query(query,(err,result)=>{
            if(err){console.log(err);res.send({success:false,msg:err}) } 
            else{
                //if userinfo doesnt exist ask user for basic info
                if(!result[0]){
                    res.render('createUser',{error:req.query.err})
                }
                //if userinfo exist show user home page
                else{
                    res.render('Home',{user:result[0]})
                }
            }
        })
    })
}

}
// post the userinfo for current user throught create user
exports.postOne=function(req,res){
    if(req.body){
        
        pool.getConnection((err,conn)=>{
            if(err) throw err;
            
            let query = `INSERT INTO userinfo(user_name,user_username,user_age,user_bio,user_location) VALUES ("${req.body.name}","${req.user.username}","${req.body.age}","${req.body.bio}","${req.body.location}")`
            conn.query(query,(err,result)=>{
                if(err) res.send({success:false,msg:err})
                else{
                    res.redirect(`/user/${req.user.username}`)
                }
            })
        })
    }
   
   
}
// get the userinfo 
exports.getOneProfile=function(req,res){
    if(!req.user){
        res.redirect('/users/login')
    }
    else{
        console.log(req.path)
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let username = req.params.uid;
        let query = `SELECT * FROM userinfo WHERE user_username='${username}'`
        return new Promise((resolve,reject)=>{
            conn.query(query,(err,result)=>{
                if(err){}

                else{res.render('profile',{user:result[0]})}
                
            })
        })
    
    })
}

}

exports.removeUserInfo = function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let uid = req.user.username;
        let query = `DELETE FROM userinfo WHERE user_username="${uid}"`
        conn.query(query,(err,result)=>{
            if(err) throw err;
            else{
                next()
            }
        })

    })
}

exports.updateOne=function(req,res){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let oldTag = req.params.tag
        let newTask = req.body.task;
        let newTag = req.body.tag;
        let query =`UPDATE mytask SET task='${newTask}',tag='${newTag}' WHERE tag='${oldTag}'`
        conn.query(query,(err,result)=>{
            if(err) res.send({success:false,msg:err})
            res.json(result)
        })
    })
}
exports.getAll = function(req,res){
    
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let query = `SELECT * FROM userinfo`

        conn.query(query,(err,result)=>{
            if(err) return {success:false,msg:err}
            res.send(result)
          
        })
    })
    
}