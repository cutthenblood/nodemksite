var passport = require('passport');
var auth = require('./../../passport.js');
module.exports = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
    auth(passport,app);

    app.post('/deathmonitor/auth', passport.authenticate('local', {failureRedirect: '/deathmonitor?autherr=1' }), function (req, res) {
        console.log(req.body["username"]);
        var user = req.body["username"];
        if(user=="Администратор")
        {

            return res.redirect('/deathmonitor/admin');
        }
        else {
            return res.redirect('/deathmonitor/fillfrm?username=' + user);
        }
    });






//    app.post('/deathmonitor/auth', function(req, res, next) {
//        passport.authenticate('local', function(err, user, info) {
//            if (err) { return next(err); }
//            if (!user) { return res.redirect('/deathmonitor'); }
//            req.logIn(user, function(err) {
//                if (err) { return next(err); }
//                if(user.username=="Администратор")
//                {
//
//                    return res.redirect('/deathmonitor/admin?username=' + user.username);
//                }
//                else {
//                    return res.redirect('/deathmonitor/fillfrm?username=' + user.username);
//                }
//            });
//        })(req, res, next);
//    });

}


