var util = require('util');
var log = require('./../../log.js')(module);
module.exports = function (app) {
    app.post('/deathmonitor/uploadform', function(req, res,next) {
        var dbmethods = app.get('dbmethods');
        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        }

        dbmethods.insup('everyday',req.body,function (err, results) {
            if (err) {
                log.error(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });

    });
}







