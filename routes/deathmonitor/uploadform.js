var util = require('util');
module.exports = function (app) {
    app.post('/deathmonitor/uploadform', function(req, res,next) {
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        console.log(req.body);
        console.log("POST");
        var dbmethods = app.get('dbmethods');
        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        }
        dbmethods.insup('everyday',req.body,function (err, results) {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                console.log(results);
                res.status(200).send();
            }
        });

    });
}







