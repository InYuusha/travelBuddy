const { Promise } = require('mongoose')
const mysql = require('mysql')

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"*Ankush*",
    database:"user"

})



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
// get the userinfo for profile
exports.getOneProfile=function(req,res,next){
    if(!req.user){
        res.redirect(`/users/login`)
    }
    else{
        
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let username = (req.params.uid?req.params.uid:req.user.username);
        let query = `SELECT * FROM userinfo WHERE user_username='${username}'`
        
            conn.query(query,(err,result)=>{
                if(err){throw err}
            
                //attach the user data in req and next middleware
                else{
                    req.userinfo = result[0];
                    next()
                }
                
            })
       
    
    })
}

}
// remove user-in
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

//add one post
exports.addOne = function(req,res,next){
    

    pool.getConnection((err,conn)=>{
        if(err) throw err;
        
      else{
          let {title,desc,place }=req.body
        let query = `INSERT INTO posts(user_id,post_title,post_desc,post_place) VALUES(${req.userinfo.user_id},"${title}","${desc}","${place}")`
        conn.query(query,(err,result)=>{
            if(err) throw err;
            else{
                next()
            }
        })
      }

    })

}
//get All profile
exports.getAllPosts =function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let query = `SELECT * FROM posts WHERE user_id=${req.userinfo.user_id}`

        conn.query(query,(err,result)=>{
            if(err) throw err;
            else{
                req.posts = result;
                next()
            }
          
        })
    })
}

exports.getLimitedPosts =function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
       
        else{ let uid = req.userinfo.user_id
            let query = `SELECT * FROM posts WHERE user_id!=${uid} LIMIT 20`

            conn.query(query,(err,result)=>{
                if(err) throw err;
                else{
                    req.posts = result;
                    next()
                }
              
            })
        }
 
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