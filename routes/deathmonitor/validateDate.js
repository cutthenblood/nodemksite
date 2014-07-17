/*
var express = require('express');
var router = express.Router();
var path = require('path');
var XlsxTemplate = require('xlsx-template');
var fs = require('fs');
var moment = require('moment');
var url = require('url');
var log = require('./../../log.js')(module);
*/
/* GET home page. *//*

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
        var date = moment(req.body.inputdate,"DD.MM.YYYY");//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
        var user = req.body.user;

        if (date=="Invalid date")
        {
            log.info("Ошибка в дате"+seldate);
            res.status(500).send("Ошибка в дате");
            return;
        }
        else
        {
            var dbmethods = app.get('dbmethods');
            var data = {"username":user};
            var weekday = date.day();
            if (weekday == 1) {
                data.startdate = date.subtract('days', 3).format("DD.MM.YYYY");
            }
            else if (weekday > 5) {
                log.info("выходной");
                res.status(500).send("выходной");
                return;
            }
            else
            {
                data.enddate = date.format("DD.MM.YYYY")
            }



            dbmethods.validateDate('everyday',data,function(err,result){
                if(result.length<=0)
                {
                    res.status(200).send("ok");
                }
                else
                {
                    res.status(200).send("not ok");
                }






            });

        }
    })
}

*/
