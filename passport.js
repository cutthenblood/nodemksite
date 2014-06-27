var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User = require('./user');
module.exports = function (passport, app) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id.toString());
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        var dbfactory = app.get('dbmethods');
        dbfactory.getUserById('users', id, function (err, user) {
            if (err) {
                console.log("cannot auth");
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
            console.log('trying', username, password);

            dbfactory.getUser('users', {username: username}, function (err, user) {
                if (err) {
                    console.log("cannot auth");
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


};

