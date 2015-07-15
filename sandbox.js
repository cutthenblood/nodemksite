var mongodb = require('mongodb');
var conf = require('./config.js');
var MongoClient = mongodb.MongoClient;
//
//MongoClient.connect(conf.mongoConnect, function (err, db) {
//
//    if (err) {
//        log.error(err);
//        return;
//    }
//
//   db.collection('kadry').find({}).toArray(function(err,result){
//
//
//
//
//
//
//
//
//   });
//
//
//
//});