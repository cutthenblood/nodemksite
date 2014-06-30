var passport = require('passport');

module.exports = function (app) {
     app.post('/deathmonitor/auth', passport.authenticate('local', {failureRedirect: '/deathmonitor?autherr=Неправильный пароль' }), function (req, res) {
            throw 'asdfasdf';
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


