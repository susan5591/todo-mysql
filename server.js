const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

const con = require("./connection");
const detailRoute = require("./routes/details");

var app = express();
const { use } = require("./routes/details");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/details",detailRoute);

app.listen(4000,()=>console.log("server has started in port 4000"));