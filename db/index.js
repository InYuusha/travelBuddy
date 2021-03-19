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
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        let username = req.params.uid;
        let query = `SELECT * FROM userinfo WHERE user_username='${dashboard}'`
        conn.query(query,(err,result)=>{
            if(err) return{success:false,msg:err}
            res.send(result)
        })
    })

}

exports.postOne=function(req,res){
   
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        
        let task = req.body.task;
        let tag = req.body.tag;

        let query = `INSERT INTO mytask(task , tag) VALUES (N'${task}','${tag}')`
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