var express = require('express');
var app = express();
const nocache = require('nocache');

app.use(nocache());

const { Pool } = require("pg");

let databasestatus = 503; 

const databaseConnection = async ()=>{
    const pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432,
    });
   
   pool.on('error',(err,client) => {
    console.error('Unexpected error on the idle client',err)
    process.exit(-1)

   })

   pool.connect((err,client,done)=>{
    if(err) throw err;
        client.query('SELECT * from employees',(err,res)=>{
            if(err){
                console.log("fetching data error",err);
                databasestatus;
            }
            else{
                console.log("database connection",res)
                databasestatus = 200;
            }

            pool.end()

    })

   })
   
};
databaseConnection();

app.get('/healthz',function(req,res){
    console.log("Endpoint");
    res.send(databasestatus);
})

app.put('/healthz',function(req,res){
    res.send(405)
})

var server = app.listen(8081, function (){
    console.log("app instance is running in port 8081")
});

