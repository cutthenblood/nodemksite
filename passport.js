var LocalStrategy = require('passport-local').Strategy;
var log = require('./log')(module);
// load up the user model
var User = require('./user');
var pg = require('./core/pgDB.js');
var config = require('./config.js');
module.exports = function (passport, app) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, JSON.stringify(user));//user._id.toString());
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        console.log(id);
        if(config.mode=='mongo'){
            var dbfactory = app.get('dbmethods');
            var collection = 'users';
            dbfactory.getUserById(collection, id, function (err, user) {
                if (err) {
                    log.error("cannot auth");
                    done(err, null);
                }
                else {
                    var dbuser = new User(user);
                    done(null, dbuser);
                }
            });
        } else if (config.mode=='pg'){
            try{
                var dbuser = JSON.parse(id);
                //var dbuser = new User(e.rows[0]);
                done(null, dbuser);
            }
            catch(e){
                console.log(e);
                done('not found', null);
            }
            /*var query = new pg(app.get('pgdb'));
            query.getUserById(id).then(function(e){
                if(e.rows.length>0){
                    var dbuser = new User(e.rows[0]);
                    done(null, dbuser);
                } else {
                    log.error("cannot auth");
                    done('not found', null);
                }

            },function(err){
                log.error(err);
                done("cannot auth", null);
            })*/
        }

    });
    passport.use('local',new LocalStrategy(
        function (username, password, done) {
            var dbfactory = app.get('dbmethods');
            dbfactory.getUserAuth('users', {id: username}, function (err, user) {
                if (err) {
                    log.error("cannot auth");
                    done(err, null);
                }
                else {
                    var dbuser = new User(user);
                    dbuser.validPassword(password, function (res) {
                        if (res) {
                            done(null, dbuser);
                        }
                        else done(null, false)
                    })
                }
            });
        }
    ));
    passport.use('local_pg',new LocalStrategy(
        {passReqToCallback: true},
        function (req,username, password, done) {
            var query = new pg(app.get('pgdb'));
            var result= query.getUserAuth(username,req.body.division);
            result.then(function(e){
                if(e.rows.length>0){
                    var dbuser = new User(e.rows[0]);
                    dbuser.validPassword(password, function (res) {
                        if (res) {
                            done(null, dbuser);
                        }
                        else done(null, false);
                        query.done();
                    })
                } else {
                    log.error("cannot auth");
                    done('not found', null);
                }
                var a = 12;
            },
            function(err){
                log.error(err);
                done("cannot auth", null);
            });
        }
    ));
};