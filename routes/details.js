const express = require("express");

const bodyParser = require("body-parser")

const route = express.Router();
const con = require("../connection");
const bcrypt = require("bcrypt");


/* 
get all the data  
returns {
    'id': int,
    name : string,
    email : varchar,
    title : varchar,
    description : varchar
}
*/
route.get("/", async (req,res)=>{
    try{        
        con.query('SELECT id,name,email,title,description FROM details where is_delete=0',(err,rows,fields)=>{
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

/* 
get data by id
returns {
    'id': int,
    name : string,
    email : varchar,
    title : varchar,
    description : varchar
}
*/
route.get("/:id",async (req,res)=>{
    try{
        const id = req.params.id;
        // const sql = 'select * from details where is_delete!=1 and id=?';
        const sql = 'select id,name,email,title,description from details where is_delete!=1 and id=?';

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



/* 
post data 
    'id': int,
    name : string,
    email : varchar,
    password : varchar,
    title : varchar,
    description : varchar
}
*/
route.post("/", async (req,res)=>{
    try{
        const salt = 10;
        const sql = 'insert into details (name,email,password,title,description) values (?,?,?,?,?)';
        const name= req.body.name;
        const email =req.body.email;
        const password=await bcrypt.hash(req.body.password,salt);
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

/* 
update data by id
    name : string,
    email : varchar,
    password : varchar,
    title : varchar,
    description : varchar
}
*/
route.patch("/:id",async (req,res)=>{
    try{
        const salt = 10;
        const id = req.params.id;
        const name= req.body.name;
        const email =req.body.email;
        const password=await bcrypt.hash(req.body.password,salt);
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


/* 
updates the is_delete value from 0 to 1
*/
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

/* 
using query
returns {
    'id': int,
    name : string,
    email : varchar,
    title : varchar,
    description : varchar
}
*/
route.get("/search/data", async (req,res)=>{
    const data = req.query.name
    const sql = 'select id,name,email,title,description from details where is_delete!=1 and details.name like "%'+data+'%"';

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

/* 
for login
input: email & password
*/
route.post("/login",async (req,res)=>{
    try{
        // const salt = 10;
        const email = req.body.email;
        const password = req.body.password;
        const sql = "select * from details where email=? and is_delete!=1";
        
        await con.query(sql,[email],(err,rows)=>{
            if(err||rows.length===0){
                return res.status(400).json({message:"Invalid email or password one"})
            }
            else{
                //coz the rows returns array.
                bcrypt.compare(req.body.password,rows[0].password,(err,result)=>{
                    if(err){
                        console.log("run1")
                        return res.status(400).send("Invalid email or password one"); 
                    }
                    if(result){
                        
                        return res.status(200).json({message:"Login successful"});
                    }

                    res.status(400).send("Invalid email or password two");  
                    
                })
            }
        })
    }catch(err){
        res.status(400).send("Invalid email or password two"); 
    }
    
})


//for dynamic catalogs
route.get('/nav/catalog', async (req,res)=>{
    try{     
        await con.query('SELECT * from catalog',(err,rows,fields)=>{   
            if(rows){
                const parent = [];
                const childOf = [];
                rows.forEach (item => {
                    const id = item.id; 
                    const parent_node = item.parent_node;
                    childOf[id]=childOf[id]||[];
                    item["child"]=childOf[id];
                    if(parent_node){
                        (childOf[parent_node]=childOf[parent_node]||[]).push(item);
                    }
                    else{
                        parent.push(item);
                    }
                });
                return res.status(200).send(parent);
            }
            else{
                return res.status(400).json({message:"Bad request"})
            }
        })
    }catch(err){
        
        return res.status(400).json({message:"Bad request"})
    }
})
module.exports = route;