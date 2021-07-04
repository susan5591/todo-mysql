const express = require("express");

const bodyParser = require("body-parser")

const route = express.Router();
const con = require("../connection");


//get all the data 
route.get("/", async (req,res)=>{
    try{        
        con.query('SELECT id,name,email,password,title,description FROM details where is_delete!=1',(err,rows,fields)=>{
        // con.query('SELECT * FROM details where is_delete=0',(err,rows,fields)=>{
            if(err){
                return res.status(400).json({message:"Bad request"})
            }
            return res.status(200).send(rows);
        })
    }catch(err){
        return res.status(400).json({message:"Bad request"})
    }
})

//get data by id
route.get("/:id",async (req,res)=>{
    try{
        const id = req.params.id;
        const sql = 'select * from details where is_delete!=1 and id=?';
        con.query(sql,[id],(err,rows,fields)=>{
            if(err || rows.length===0){
                return res.status(400).json({message:"Bad request"})
            }
            else{
                return res.status(200).send(rows);
            }
        })
    }catch(err){
        return res.status(400).json({message:"Bad request"})
    }
})


//post the data
route.post("/", async (req,res)=>{
    try{
        const sql = 'insert into details (name,email,password,title,description) values (?,?,?,?,?)';
        const name= req.body.name;
        const email =req.body.email;
        const password=req.body.password;
        const title =req.body.title;
        const description =req.body.description
        const values = [name,email,password,title,description]
        
        con.query(sql,values,(err,rows,fields)=>{
            if(err ){
                return res.status(400).json({message:"Bad request"})
            }
            else{
                return res.status(200).send("Posted Successfully");
            }
        })
    }catch(err){
        return res.status(400).json({message:"Bad request"})
    }
})

//update data by id
route.patch("/:id",async (req,res)=>{
    try{
        const id = req.params.id;
        const name= req.body.name;
        const email =req.body.email;
        const password=req.body.password;
        const title =req.body.title;
        const description =req.body.description
        const values = [name,email,password,title,description,id]
        const sql1 = "update details set name=?, email=?,password=?,title=?,description=? where id=?";
        con.query(sql1,values,(err,rows,fields)=>{
            if(rows.affectedRows){
                return res.status(400).json({message:"updtated successful"})
            }
            else{
                return res.status(200).send("update unsuccessful");
            }
        })
        
    }   
    catch(err){
        return res.status(400).json({message:"Bad request"})
    }
})


//delete data by id
route.delete("/:id", async (req,res)=>{
    try{
        const id = req.params.id;
        const sql = 'update details set is_delete=1 where id=?';
            con.query(sql,[id],(err,rows,fields)=>{
            if(rows.affectedRows){
                return res.status(200).send("Deleted Successfully");
            }
            else{
                
                return res.status(400).json({message:"Bad request"})
            }
        })

    }catch(err){
        return res.status(400).json({message:"Bad request"})
    }    
})

//for search 
route.get("/search/data", async (req,res)=>{
    const data = req.query.name
    const sql = 'select * from details where is_delete!=1 and details.name like "%'+data+'%"';
    con.query(sql,(err,rows,fields)=>{
        if(err ){
            return res.status(400).json({message:"Bad request"})
        }
        else if(rows.length ===0){
            return res.status(200).send("No such data found");
        }else{
            return res.status(200).send(rows);
        }
    })
})

//forlogin
route.post("/login",async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    const sql = "select * from details where email=? and password=? and is_delete!=1";
    con.query(sql,[email,password],(err,rows)=>{
        if(err){
            return res.status(400).json({message:"Bad Request"})
        }
        else if(rows.length === 0){
            return res.status(404).json({message:"Not Found"})
        }
        else{
            return res.send("Login Successful..")
        }
    })
})
module.exports = route;