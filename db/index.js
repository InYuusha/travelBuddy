const { Promise, connection } = require('mongoose')
const mysql = require('mysql')
const moment = require('moment')

const pool = mysql.createPool({
    host:"travel.cnfynhorhon5.ap-south-1.rds.amazonaws.com",
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
                conn.release();
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
        let username;
        if(err) throw err;

        if(req.anotherUser){
             username = req.params.auid;
             let query = `SELECT * FROM userinfo WHERE user_username='${username}'`
        
             conn.query(query,(err,result)=>{
                 conn.release();
                 if(err){throw err}
             
                 //attach the user data in req and next middleware
                 else{
                     req.anotherUserInfo= result[0];
                     next()
                 }
                 
             })
        }
        else{
             username = (req.params.uid?req.params.uid:req.user.username);
             let query = `SELECT * FROM userinfo WHERE user_username='${username}'`
        
             conn.query(query,(err,result)=>{
                 conn.release();
                 if(err){throw err}
             
                 //attach the user data in req and next middleware
                 else{
                     req.userinfo = result[0];
                     next()
                 }
                 
             })
        }
      
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
            conn.release();
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
          let post_time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss') 
        let query = `INSERT INTO posts(user_id,user_username,post_title,post_desc,post_place,post_time) VALUES(${req.userinfo.user_id},"${req.userinfo.user_username}","${title}","${desc}","${place}",'${post_time}')`
        conn.query(query,(err,result)=>{
            conn.release();
            if(err) throw err;
            else{
                next()
            }
        })
        }
  })
}
//get All posts for a specific user
exports.getAllPosts =function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        if(req.anotherUser){
            let query = `SELECT * FROM posts WHERE user_id=${req.anotherUserInfo.user_id} ORDER BY post_id DESC`

            conn.query(query,(err,result)=>{
                conn.release();
                if(err) throw err;
                else{
                    req.posts = result;
                    next()
                }
              
            })
        }
        else{
            let query = `SELECT * FROM posts WHERE user_id=${req.userinfo.user_id} ORDER BY post_id DESC`

            conn.query(query,(err,result)=>{
                conn.release();
                if(err) throw err;
                else{
                    req.posts = result;
                    next()
                }
              
            })
        }
     
    })
}

// remove all posts for a specific user 
//used for deleteing user
exports.removeAllPosts =function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let query = `DELETE FROM posts WHERE user_id=${req.userinfo.user_id}`

        conn.query(query,(err,result)=>{
            conn.release();
            if(err) throw err;
            else{ 
                next()
            }
        })
    })
}
exports.getLimitedPosts =function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        else{ let uid = req.userinfo.user_id
            let query = `SELECT * FROM posts WHERE user_id!=${uid} ORDER BY post_id DESC LIMIT 20`
            conn.query(query,(err,result)=>{
                conn.release();
                if(err) throw err;
                else{
                    req.posts = result;
                    next()
                }
            })
        }
    })
}
exports.getLimitedUsers =  function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err; 
      else{
        username = (req.params.uid?req.params.uid:req.user.username);
        let query = `SELECT * FROM userinfo WHERE user_username!='${username}' ORDER BY user_id DESC LIMIT 5`
        conn.query(query,(err,result)=>{
            conn.release();
            if(err) throw err;
            else{
                req.users = result
                next()
            }
        })
      }

    })

}
exports.removeOnePost =function(req,res,next){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let query = `DELETE FROM posts WHERE post_id=${req.query.post_id}`

        conn.query(query,(err,result)=>{
            conn.release();
            if(err) throw err;
            else{ 
                next()
            }
        })
    })
}
