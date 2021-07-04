const mysql = require("mysql");

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"todo"
});

con.connect((err)=>{
    if(err){
        return console.log("Error while connecting to database")
    }
    else{
        return console.log("Connected to database");
    }
    
})

module.exports = con;