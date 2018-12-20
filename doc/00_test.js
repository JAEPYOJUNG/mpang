var MongoClient = require('mongodb').MongoClient;
var util = require("util");

var clog = require("clog");
clog.configure({"log level": 5});

var db;



// DB 접속
var conn;
var db;


MongoClient.connect('mongodb://jaepyo:a12345@ds225624.mlab.com:25624',function(err,client){
  if(err){
    clog.error(err);
  }else{
    clog.info('DB접속완료');
    conn = client;
    db =client.db('mpang'); //mydb 대신
 
  }
});