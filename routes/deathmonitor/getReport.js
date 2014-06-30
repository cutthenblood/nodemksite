var express = require('express');
var router = express.Router();
var path = require('path');
var XlsxTemplate = require('xlsx-template');
var fs = require('fs');
var moment = require('moment');
var url = require('url');
var log = require('./../../log.js')(module);
/* GET home page. */
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/deathmonitor');
}

module.exports = function(app) {
    app.get('/deathmonitor/getReport',isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
        if (seldate=="Invalid date")
        {
            log.info("Ошибка в дате"+seldate);
            res.status(500).send("Ошибка в дате");
            return;
        }
        fs.readFile(path.join(__dirname, '../../templates/tmpl.xlsx'), function (err, data) {
            if(err)
            {
                log.error(err);
                res.status(500).send("readfile error");
                return;
            }

            var dbmethods = app.get('dbmethods');
            dbmethods.getByInputDate('everyday', seldate, function (err,result) {
                if(err){
                    log.error(err);
                    res.status(500).send(err);
                    return;
                }
                else {
                    var rows = [];
                    var sumrow = {'gr2': 0, 'gr3': 0, 'gr4': 0, 'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
                        'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0, 'gr18': 0, 'gr19': 0, 'gr20': 0, 'gr21': 0, 'gr22': 0, 'gr23': 0, 'gr24': 0, 'gr25': 0, 'gr26': 0,
                        'gr27': 0, 'gr28': 0, 'gr29': 0, 'gr30': 0, 'gr31': 0, 'gr32': 0, 'gr33': 0
                    };
                    if (result.length < 1) {
                        res.status(500).send("Нет данных за этот день");
                        return;
                    }
                    result[0].rows.forEach(function (item) {
                        var date = seldate;
                        rows.push(item);
                        for (var key in sumrow) {
                            sumrow[key] += item[key];
                        }
                    });
                    var template = new XlsxTemplate(data);
                    var sheetNumber = 10;
                    var sumres = [sumrow];
                    var values = {
                        date: new Date(),
                        grs: rows,
                        sgrs: sumres
                    };
                    template.substitute(sheetNumber, values);
                    var result = template.generate();
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                    res.status(200).end(result, 'binary');
                }
            });
        });
    })
}

