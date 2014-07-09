var util = require('util');
var log = require('./../../log.js')(module);
var moment = require('moment');
module.exports = function (app) {
    app.post('/deathmonitor/uploadform', function(req, res,next) {
        var dbmethods = app.get('dbmethods');
        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        }

        function convertDatesISO(date)
        {
            return new Date(moment(date,"DD.MM.YYYY").format("MM.DD.YYYY"));
        }

        req.body.inputdate = convertDatesISO(req.body.inputdate);
        req.body.rows[0].date = new Date(req.body.rows[0].date);
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







