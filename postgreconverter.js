var pg = require('pg');
var mongodb = require('mongodb');
var conf = require('./config.js');
var conString = "postgres://postgres:admin@localhost/mksite";
var vow = require('vow');
var vowNode = require('vow-node');

var promiseQuery = function(obj,config,values){
    var fn = vowNode.promisify(pg.Client.prototype.query);
    if(values)
        return fn.call(obj, config,values);
    else
        return fn.call(obj, config);
}


pg.connect(conString, function(err, client, done) {
    if(err) {
        return console.error('error fetching client from pool', err);
    }
    var MongoClient = mongodb.MongoClient;
    MongoClient.connect(conf.mongoConnect, function (err, db) {
        if (err) {
            console.log(err);

        } else {
            db.collection('users').find({'username':{$ne:'Администратор'}}).toArray(function (err1, result) {
                var promises=[];

                if (err1) {
                    console.log(err1)
                } else {

                    var pgPromises = [promiseQuery(client,'select * from mos'),promiseQuery(client,'select * from divisions where id=2'),
                        promiseQuery(client,'select * from roles where id =2'),promiseQuery(client,'select * from uzs')];
                    vow.allResolved(pgPromises).spread(function spread(moses,divisions,roles,uzs){
                        if (moses.isRejected() || divisions.isRejected() || roles.isRejected() || uzs.isRejected()) {
                            console.log('error');
                        } else{
                            done();
                            var mos = moses.valueOf();
                            var division = divisions.valueOf();
                            var role = roles.valueOf();
                            var uz = uzs.valueOf();
                            var pgusers = [];

                            result.map(function(user){
                                var pguser={};
                                pguser.username = user.username;
                                pguser.pwd = user.password;
                                pguser.division = division.rows[0].id;
                                pguser.role = role.rows[0].id;
                                pguser.umo = [];
                                pguser.uuz = [];
                                try {
                                    if ('mo' in user) {
                                        user.mo.map(function (mo_itm) {
                                            var fmo = mos.rows.filter(function (mo) {
                                                return mo.name == mo_itm.fullname;
                                            });
                                            fmo.forEach(function (itm) {
                                                pguser.umo.push(itm.id);
                                            })
                                        })
                                    }
                                    if ('uz' in user) {
                                        var fuz = uz.rows.filter(function (uz) {
                                            return uz.name == user.uz;
                                        });
                                        pguser.uuz.push(fuz[0].id);
                                    }
                                }
                                catch(e){
                                    console.log(e);
                                }

                                var a=12;


                                /*client.query('INSERT INTO users(division, role, pwd, username) VALUES ($1, $2, $3, $4) RETURNING id;',
                                    [division.rows[0].id, role.rows[0].id, user.password, user.username],function(err,r){
                                        console.log(err);
                                        var a=12;
                                        done();
                                    });*/

                            })
                        }
                    });
                }
            });
        }
    });
});



/*

var client = new pg.Client(conString);
client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    var cn = function(err,res){
        if(err)
            console.log(err);
    }







    */
/*client.query('SELECT NOW() AS "theTime"', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log(result.rows[0].theTime);
        //output: Tue Jan 15 2013 19:12:47 GMT-600 (CST)
        client.end();
    });*//*

});*/
