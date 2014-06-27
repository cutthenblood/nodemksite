var url = require('url');
var _ = require('lodash');
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/deathmonitor');
}
module.exports = function (app) {
    app.get('/deathmonitor/admin',isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var dbmethods = app.get('dbmethods');
        dbmethods.getLates('everyday',function(result){

            if(result[0].rows.length>0){
                var data = result[0].rows;
                dbmethods.getUsers('users',function(rslt){
                    var userarr = _.reduce(rslt, function(rs, num){
                         rs.push(num.username);
                        return rs;
                    },[]);
                    var dataarr = _.reduce(data, function(rs, num){
                         rs.push(num.username);
                        return rs;
                    },[]);
                    var diff = _.difference(userarr,dataarr);
                    res.render('deathmonitor/admin', {message: diff});
                });



            }
            else{
                res.render('deathmonitor/admin', {message: []});
            }


        });


    });
}
