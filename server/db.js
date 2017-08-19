module.exports = function(app) {

    var assert = require('assert');
    // Read configurations
    var config = require('./config');
    // Load MongoDB Nodejs Driver - MongoClient
    var MongoClient = require('mongodb').MongoClient;
    // MongoDB Connection URL
    // var url = config.MONGO_URI;
    var url = "mongodb://mattliou96:merrynml96@jamathon-shard-00-00-hxnza.mongodb.net:27017,jamathon-shard-00-01-hxnza.mongodb.net:27017,jamathon-shard-00-02-hxnza.mongodb.net:27017/jamathon?ssl=true&replicaSet=Jamathon-shard-0&authSource=admin";
    // var url = 'mongodb://localhost/jamathon';
    // console.log("url: " + url);
    // Create the database connection
    MongoClient.connect(url, {  
        poolSize: 10
        // other options can go here
    },function(err, db) {
        assert.equal(null, err);
        app.locals.db = db; // access using req.app.local.db at the routes
        //console.log(db);
    });
    
}