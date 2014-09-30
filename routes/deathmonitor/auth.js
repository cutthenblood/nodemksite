var passport = require('passport');

module.exports = function (app) {

     app.post('/deathmonitor/auth', passport.authenticate('local', {failureRedirect: '/deathmonitor?autherr=Неправильный пароль' }), function (req, res) {
        var user = req.body["username"];
        if(user=="Администратор")
        {
            return res.redirect('/deathmonitor/admin');
        }
        else {
            return res.redirect('/deathmonitor/fillfrm');
        }
    });

};


