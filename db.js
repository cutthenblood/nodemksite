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
    var convertDatesISO = function(date)
    {
        return new Date(moment(date,"DD.MM.YYYY").format("MM.DD.YYYY"));
    };
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
                .find({inputdate: {$lte: convertDatesISO(date), $gte: convertDatesISO(date.subtract('days', 3))}}, {"rows.username": 1})
                .toArray(function (err, result) {
                    errproc(err,result,callback);
                });
        }
        else if (weekday > 5) {
            callback(null, []);
        }
        else {
            this._db.collection(collection).find({inputdate: convertDatesISO(date)}, {"rows.username": 1})
                .toArray(function (err, result) {
                    errproc(err,result,callback);
                });
        }
    },
    this.validateDate = function(collection,data,callback){
            /*        db.everyday.aggregate(
             {$match: {$and:[{"inputdate":{$gte:ISODate("2014-07-14T20:00:00.000Z")}},{"inputdate":{$lte:ISODate("2014-07-15T20:00:00.000Z")}}]}  },
             {$unwind:"$rows"},
             {$match:{"rows.username":"Мостовской"}},
             {$project:{"inputdate":1}}
             )*/

            var beg = convertDatesISO(data.startdate);
            var end =convertDatesISO(data.enddate);
            console.log("st: "+convertDatesISO(data.startdate)+" ent: "+convertDatesISO(data.enddate)+" username "+data.username);
            this._db.collection(collection).aggregate(
                {$match: {"inputdate": {$gte: beg, $lt: end}}},
                {$unwind:"$rows"},
                {$match:{"rows.username":data.username}},
                {$project:{"inputdate":1}},function(err,result){
                    errproc(err,result,callback);
                });
        };
    this.validateDate1 = function(collection,data,callback){
        /*        db.everyday.aggregate(
         {$match: {$and:[{"inputdate":{$gte:ISODate("2014-07-14T20:00:00.000Z")}},{"inputdate":{$lte:ISODate("2014-07-15T20:00:00.000Z")}}]}  },
         {$unwind:"$rows"},
         {$match:{"rows.username":"Мостовской"}},
         {$project:{"inputdate":1}}
         )*/

        var beg = data.startdate;
        var end = data.enddate;
        console.log("st: "+beg+" end: "+end+" username "+data.username);
        this._db.collection(collection).aggregate(
            {$match: {"inputdate": {$gte: beg, $lt: end}}},
            {$unwind:"$rows"},
            {$match:{"rows.username":data.username}},
            {$project:{"inputdate":1}},function(err,result){
                errproc(err,result,callback);
            });
    };
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
    this.getByInputDate = function (collection, startdate,stopdate, callback) {
            var beg = convertDatesISO(startdate);
            var end = convertDatesISO(stopdate);
            this._db.collection(collection).find({inputdate: {$gte:beg,$lt:end}}).toArray(function (err, result) {
                errproc(err,result,callback);
            });
        };
    this.getRaisingSum = function(collection,startdate,stopdate,callback) {
        /*db.everyday.aggregate({$unwind:"$rows"},{$match:{"rows.date":{$gte:ISODate("2014-01-01T00:00:00.000Z"),$lte:ISODate("2014-07-08T23:59:59.000Z")}}}
         ,{$group:{"_id":"$rows.username",smgr2:{$sum:"$rows.gr2"},
         smgr3:{$sum:"$rows.gr3"},smgr4:{$sum:"$rows.gr4"},smgr5:{$sum:"$rows.gr5"},smgr6:{$sum:"$rows.gr6"},smgr7:{$sum:"$rows.gr7"},
         smgr8:{$sum:"$rows.gr8"},smgr9:{$sum:"$rows.gr9"},smgr10:{$sum:"$rows.gr10"},smgr11:{$sum:"$rows.gr11"},smgr12:{$sum:"$rows.gr12"},
         smgr13:{$sum:"$rows.gr13"},smgr14:{$sum:"$rows.gr14"},smgr15:{$sum:"$rows.gr15"},smgr16:{$sum:"$rows.gr16"},smgr17:{$sum:"$rows.gr17"},
         smgr18:{$sum:"$rows.gr18"},smgr19:{$sum:"$rows.gr19"},smgr20:{$sum:"$rows.gr20"},smgr21:{$sum:"$rows.gr21"},smgr22:{$sum:"$rows.gr22"},
         smgr23:{$sum:"$rows.gr23"},smgr24:{$sum:"$rows.gr24"},smgr25:{$sum:"$rows.gr25"},smgr26:{$sum:"$rows.gr26"},smgr27:{$sum:"$rows.gr27"},
         smgr28:{$sum:"$rows.gr28"},smgr29:{$sum:"$rows.gr29"},smgr30:{$sum:"$rows.gr30"},smgr31:{$sum:"$rows.gr31"},smgr32:{$sum:"$rows.gr32"},
         smgr33:{$sum:"$rows.gr33"}
         }})
         */
        var beg = convertDatesISO(startdate);
        var end =convertDatesISO(stopdate);
        try {
            this._db.collection(collection).aggregate(
                {$unwind: "$rows"},
                {$match: {"inputdate": {$gte: beg, $lte: end}}},
                {$group: {"_id": "$rows.username", gr2: {$sum: "$rows.gr2"},
                    gr3: {$sum: "$rows.gr3"}, gr4: {$sum: "$rows.gr4"}, gr5: {$sum: "$rows.gr5"}, gr6: {$sum: "$rows.gr6"}, gr7: {$sum: "$rows.gr7"},
                    gr8: {$sum: "$rows.gr8"}, gr9: {$sum: "$rows.gr9"}, gr10: {$sum: "$rows.gr10"}, gr11: {$sum: "$rows.gr11"}, gr12: {$sum: "$rows.gr12"},
                    gr13: {$sum: "$rows.gr13"}, gr14: {$sum: "$rows.gr14"}, gr15: {$sum: "$rows.gr15"}, gr16: {$sum: "$rows.gr16"}, gr17: {$sum: "$rows.gr17"},
                    gr18: {$sum: "$rows.gr18"}, gr19: {$sum: "$rows.gr19"}, gr20: {$sum: "$rows.gr20"}, gr21: {$sum: "$rows.gr21"}, gr22: {$sum: "$rows.gr22"},
                    gr23: {$sum: "$rows.gr23"}, gr24: {$sum: "$rows.gr24"}, gr25: {$sum: "$rows.gr25"}, gr26: {$sum: "$rows.gr26"}, gr27: {$sum: "$rows.gr27"},
                    gr28: {$sum: "$rows.gr28"}, gr29: {$sum: "$rows.gr29"}, gr30: {$sum: "$rows.gr30"}, gr31: {$sum: "$rows.gr31"}, gr32: {$sum: "$rows.gr32"},
                    gr33: {$sum: "$rows.gr33"}
                }},function (err, result) {
                    errproc(err, result, callback);
                });
        }
        catch(e){
            log.error(e);
        }



    };
    this.getOrgmMpr = function(collection,startdate,stopdate,callback) {
        this._db.collection(collection).aggregate(
            {$unwind:"$rows"},
            {$match:{"inputdate":{$gte:parseInt(startdate),$lte:parseInt(stopdate)}}},
            {$group:{
                "_id":{"user":"$rows.username","mo":"$rows.mo"},
                "gr5":{$sum:"$rows.gr5"},"gr6":{$sum:"$rows.gr6"},"gr7":{$sum:"$rows.gr7"},"gr8":{$sum:"$rows.gr8"},"gr9":{$sum:"$rows.gr9"},
                "gr10":{$sum:"$rows.gr10"},"gr14":{$sum:"$rows.gr14"},"gr18":{$sum:"$rows.gr18"},"gr22":{$sum:"$rows.gr22"},"gr26":{$sum:"$rows.gr26"},
                "gr11":{$sum:"$rows.gr11"},"gr15":{$sum:"$rows.gr15"},"gr19":{$sum:"$rows.gr19"},"gr23":{$sum:"$rows.gr23"},"gr27":{$sum:"$rows.gr27"},
                "gr12":{$sum:"$rows.gr12"},"gr16":{$sum:"$rows.gr16"},"gr20":{$sum:"$rows.gr20"},"gr24":{$sum:"$rows.gr24"},"gr28":{$sum:"$rows.gr28"},
                "gr13":{$sum:"$rows.gr13"},"gr17":{$sum:"$rows.gr17"},"gr21":{$sum:"$rows.gr21"},"gr25":{$sum:"$rows.gr25"},"gr29":{$sum:"$rows.gr29"},
                "gr30":{$sum:"$rows.gr30"},"gr31":{$sum:"$rows.gr31"},"gr32":{$sum:"$rows.gr32"},"gr33":{$sum:"$rows.gr33"},"gr34":{$sum:"$rows.gr34"}
            }}
            ,function (err, result) {
            errproc(err,result,callback);
        });
    };




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
            this._db.collection(collection).find({},{'division':1,'username':1,'mo':1}).toArray(function (err, result) {
                errproc(err,result,callback);
                /*  if (err) {
                 if (err) throw err;
                 } else {
                 callback(result);
                 }*/
            });


        },
     this.getUsersArg = function (arg,collection, callback) {
            this._db.collection(collection).find(arg.query,arg.fields).toArray(function (err, result) {
                errproc(err,result,callback);
                /*  if (err) {
                 if (err) throw err;
                 } else {
                 callback(result);
                 }*/
            });


        }
};

/*mongodb.MongoClient.connect('mongodb://10.46.1.210:27017/deathmonitor',function(err,db){
 if (err) throw err;
 var dbmethods = app.get('dbmethods');
 if (!dbmethods){
 app.set('dbmethods',new dbfactory(db));
 }


 });*/



//}