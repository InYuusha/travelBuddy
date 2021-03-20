const mysql = require('mysql')

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"*Ankush*",
    database:"user"

})

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

exports.postOne=function(req,res){
   
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        
        

        let query = `INSERT INTO userinfo(user_name,user_age,user_bio,user_location) VALUES (${req.body.name},${req.body.age},${req.body.bio},${req.body.location})`
        conn.query(query,(err,result)=>{
            if(err) res.send({success:false,msg:err})
            res.send(result)
        })
    })
}

exports.removeOne = function(req,res){
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let query = `DELETE FROM mytask WHERE tag='${req.params.tag}'`
        conn.query(query,(err,result)=>{
            if(err) res.send({success:false,msg:err})
            res.json(result)
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