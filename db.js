//module.exports = function(app) {
var mongodb = require('mongodb');
var utl = require('util');
var moment = require('moment');
var log = require('./log.js')(module);


function errproc(err, result, func, elsefunc) {
    if (err) {
        log.error(err);
        func(err, null);
    }
    else if (elsefunc) {
        elsefunc();
    }
    else {
        func(null, result);
    }
}
module.exports = function (db) {
    this._db = db;
    /*  this.getCollection = function (collection, callback) {
     this._db.collection(collection).find().toArray(function (err, result) {
     if (err) {
     winston.error(err);
     callback(err,null)
     }
     callback(null,result);
     });
     },*/
    this.getLates = function (collection, callback) {
        var date = moment();
        //var curdayoffset = date.startOf('day').fromNow(true).split(" ")[0];
        //if (curdayoffset)
        var weekday = date.day();
        if (weekday == 1) {
            this._db.collection(collection)
                .find({inputdate: {$lte: date.format("DD.MM.YYYY"), $gte: date.subtract('days', 3).format("DD.MM.YYYY")}}, {"rows.username": 1})
                .toArray(function (err, result) {
                    errproc(err,result,callback);
                });
        }
        else if (weekday > 5) {
            callback(null, []);
        }
        else {
            this._db.collection(collection).find({inputdate: date.format("DD.MM.YYYY")}, {"rows.username": 1})
                .toArray(function (err, result) {
                    errproc(err,result,callback);
                });
        }
    },
    this.insup = function (collection, data, callback) {
            var _this = this;
            var inputdate = data.inputdate;
            var row = data.rows;
            var username = row[0].username;
            this._db.collection(collection).find({inputdate: inputdate}, {_id: 1}).toArray(function (err, result) {
                errproc(err, result, callback, function () {
                        var docid = result;
                        if (docid.length == 1) {
                            _this._db.collection(collection).update({ _id: docid[0]._id}, { $pull: {"rows": {"username": username}}}, function (err, result) {
                                errproc(err, result, callback, function () {
                                        _this._db.collection(collection).update({ inputdate: inputdate}, { $push: {"rows": row[0]}}, function (err, result) {
                                            errproc(err, result, callback);
                                        });
                                    }
                                );
                            });
                        }
                        else {
                            _this.insert(collection, data, callback);
                        }
                    }
                );


                /* if (err) {
                 log.error(err);
                 callback(err, null)
                 }
                 else {
                 var docid = result;
                 if (docid.length == 1) {
                 _this._db.collection(collection).update({ _id: docid[0]._id}, { $pull: {"rows": {"username": username}}}, function (err, result) {
                 if (err) {
                 log.error(err);
                 callback(err, null)
                 }
                 else {
                 _this._db.collection(collection).update({ inputdate: inputdate}, { $push: {"rows": row[0]}}, function (err, result) {
                 if (err) {
                 log.error(err);
                 callback(err, null)
                 }
                 else {
                 callback(null, result);
                 }
                 });
                 }

                 });
                 }
                 else {
                 _this.insert(collection, data, callback);
                 }
                 }*/
            });
        },
    this.getByInputDate = function (collection, inputdate, callback) {
            this._db.collection(collection).find({inputdate: inputdate}).toArray(function (err, result) {
                errproc(err,result,callback);
            });
        };
    this.getRaisingSum = function(collection,stopdate,callback) {




    }




    /*this.delete = function (collection, id, callback) {
        this._db.collection(collection).remove({_id: new mongodb.ObjectID(id)}, callback);
    },*/
       /* this.update = function (collection, id, data, callback) {
            this._db.collection(collection).update({_id: new mongodb.ObjectID(id)}, {"$set": data}, callback);
        },*/
    this.insert = function (collection, data, callback) {

            this._db.collection(collection).insert(data, callback);
        }
    this.getUserById = function (collection, id, callback) {
        this._db.collection(collection).find({_id: new mongodb.ObjectID(id)}).toArray(function (err, result) {
            errproc(err,result,function(){
                if (result.length) {
                    callback(null, result[0]);
                } else {
                    callback('user not exists',null);
                }
            });


            /*if (err) {
                callback(err, null);
            } else {
                if (result.length) {
                    console.log('user exists');
                    callback(null, result[0]);
                } else {
                    console.log('user not exists');
                    callback(null);
                }
            }*/
        });

    },
        this.getUser = function (collection, credentials, callback) {
            console.log(credentials);
            this._db.collection(collection).find(credentials).toArray(function (err, result) {
                errproc(err,result,function(){
                    if (result.length) {
                        callback(null, result[0]);
                    } else {
                        callback('user not exists',null);
                    }
                });
               /* if (err) {
                    callback(err, null);
                } else {
                    if (result.length) {
                        console.log('user exists');
                        callback(null, result[0]);
                    } else {
                        console.log('user not exists');
                        callback(null);
                    }
                }*/
            });


        },
        this.getUsers = function (collection, callback) {
            this._db.collection(collection).find({}, {"username": 1, _id: 0}).toArray(function (err, result) {
                errproc(err,result,callback);
              /*  if (err) {
                    if (err) throw err;
                } else {
                    callback(result);
                }*/
            });


        }
}

/*mongodb.MongoClient.connect('mongodb://10.46.1.210:27017/deathmonitor',function(err,db){
 if (err) throw err;
 var dbmethods = app.get('dbmethods');
 if (!dbmethods){
 app.set('dbmethods',new dbfactory(db));
 }


 });*/



//}