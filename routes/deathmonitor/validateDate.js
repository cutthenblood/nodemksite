var express = require('express');
var router = express.Router();
var path = require('path');
var util = require('util');
var fs = require('fs');
var moment = require('moment');
var url = require('url');
var log = require('./../../log.js')(module);
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/deathmonitor');
}

var prcalend = [
    {"month":"11",
        "holydays":[{"month":"10","dates":["31"]},{"month":"11","dates":["1","2","3","4"]}]
    }
];


module.exports = function(app) {
    app.post('/deathmonitor/validateDate',isLoggedIn, function (req, res) {
        var startdate =req.body.startdate;//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
        var enddate = req.body.enddate;
        var username = req.body.username;
        console.log(util.inspect(req.body));

        var dbmethods = app.get('dbmethods');
        var data = {"username":username,"startdate":startdate,"enddate":enddate};
        dbmethods.validateDate('everyday',data,function(err,result){
            if (err)
            {
                log.info(err);
                res.status(500).send("Ошибка");
                return;
            }
            console.log(util.inspect(result));
            if(result.length<1)
            {
                console.log("ok");
                res.status(200).send("ok");
            }
            else
            {
                console.log("no");
                res.status(200).send("no");
            }
        });


    })
}

