var LocalStrategy = require('passport-local').Strategy;
var log = require('./log')(module);
// load up the user model
var User = require('./user');
var pg = require('./core/pgDB.js');
module.exports = function (passport, app) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id.toString());
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
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
    });
    passport.use('local',new LocalStrategy(
        function (username, password, done) {
            var dbfactory = app.get('dbmethods');
            dbfactory.getUserAuth('users', {username: username}, function (err, user) {
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
        function (username, password, done) {
            var query = new pg(app.get('pgdb'));
            var result= query.getUserAuth(username);
            result.then(function(e){
                if(e.rows.length>0){
                    var dbuser = new User(e.rows[0]);
                    dbuser.validPassword(password, function (res) {
                        if (res) {
                            done(null, dbuser);
                        }
                        else done(null, false)
                    })
                }
                var a = 12;
            });
        }
    ));
};