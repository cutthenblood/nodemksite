var express = require('express');
var router = express.Router();
var path = require('path');
var util = require('util');
var fs = require('fs');
var moment = require('moment');
var XlsxTemplate = require('xlsx-template');
var url = require('url');
var log = require('./../../log.js')(module);
var passport = require('passport');
var _ =require('lodash');
var prcalend = [
    {"month":"11",
        "holydays":[{"month":"10","dates":["31"]},{"month":"11","dates":["1","2","3","4"]}]
    }
];
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/mmo/');
};
module.exports = function (app) {
    app.get('/mmo', function (req, res) {
        var browser = req.headers['user-agent'];
        console.log(browser);
        if (browser.indexOf('Chrome')>-1 || browser.indexOf('Safari')>-1 || browser.indexOf('Opera')>-1 || browser.toLowerCase().indexOf('firefox') >-1)
        {
            var url_parts = url.parse(req.url, true);
            var query = url_parts.query;
            var err =[];
            if(query.autherr)  err.push(query.autherr);
            var dbmethods = app.get('dbmethods');
            dbmethods.getUsers('users',function(er,result){
                if (er)
                {
                    log.info(er);
                    res.status(500).send("Ошибка");
                    return;
                } else res.render('mmo/mmoLogin', {users:result
                    .filter(function(itm){ if (itm.division == 'mmo') return itm;})
                    .sort(function(a,b){
                        if (a.username < b.username) {
                            return -1;
                        }
                        else if (a.username > b.username) {
                            return 1;
                        } else
                            return 0;
                    })
                    , message: err });
            });
        }
        else res.status(503).send('эта версия браузера не поддерживается,обратитесь к системноу администатору для установки google chrome  <a href="https://www.google.ru/intl/ru/chrome/browser/index.html">https://www.google.ru/intl/ru/chrome/browser/index.html</a>, так же поддерживаются последние версии Opera, Yandex Browser, Safari, FireFox');
    });
    app.post('/mmo/auth', passport.authenticate('local', {failureRedirect: '/mmo?autherr=Wrong password' }), function (req, res) {
        var user = req.body["username"];
        if(user=="Администратор")
        {
            return res.redirect('/mmo/admin');
        }
        else {
            return res.redirect('/mmo/mmoIndex');
        }
    });
    app.get('/mmo/logout', function(req, res){
        req.logout();
        res.redirect('/mmo');
    });
    app.get('/mmo/mmoIndex',isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        res.render('mmo/mmoIndex', {name: req.user.username});
    });
    //todo заточить под разные отчеты
    app.post('/mmo/validateDate',isLoggedIn, function (req, res) {
        var startdate =req.body.startdate;//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
        var enddate = req.body.enddate;
        var username = req.body.username;
        console.log(util.inspect(req.body));

        var dbmethods = app.get('dbmethods');
        var data = {"username":username,"startdate":startdate,"enddate":enddate};
        dbmethods.validateDate1('mmoOfosvkr',data,function(err,result){
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
    });
    app.post('/mmo/ofosvkr/uploadform',isLoggedIn, function(req, res,next) {
        var dbmethods = app.get('dbmethods');
        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        };
        dbmethods.ins('mmoOfosvkr',req.body,function (err, results) {
            if (err) {
                log.error(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });

    });
    app.get('/mmo/admin', isLoggedIn, function (req, res) {
        res.render('mmo/mmoAdmin', {});
    });
    app.get('/mmo/mmoAdminReport', isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        fs.readFile(path.join(__dirname, '../../templates/mmo/ofosvkr.xlsx'), function (err, data) {
            if(err)
            {
                log.error(err);
                res.status(500).send("readfile error");
                return;
            }

            try {
                var template = new XlsxTemplate(data);
                var sheetNumber = 1;
            }
            catch(e)
            {
                log.error(e);
            }

            var dbmethods = app.get('dbmethods');
            if (query.type =='ofosvkrreport')
                dbmethods.getMmoOfosvkr('mmoOfosvkr',query.beg,function(err,result){
                    if(err){
                        log.error(err);
                        res.status(500).send(err);
                        return;
                    }
                    var rows = [];
                    var scm = require('./../../public/schemas/mmo/ofosvkrScm.js');
                    var row = {'nn':'','gr2': '','gr3': '','gr4': '','gr5': '', 'gr6': '', 'gr7': '', 'gr8': '', 'gr9': '', 'gr10': '', 'gr11': '', 'gr12': ''};
                    var rowSum = {'nn':'','gr2': 'Итого','gr3': '','gr4': '','gr5': '', 'gr6': '', 'gr7': '', 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': ''}


                    if (result.length < 1) {
                        res.status(500).send("Нет данных за этот период");
                        return;
                    }
                    var beg = moment(parseInt(query.beg));


                    var header_date=beg.format("DD.MM.YYYY");
                    var ind=1;
                    var grouped = _.chain(result[0].rows)
                                   .groupBy(function(val){return val.username;})
                                    .pairs()
                                    .sortBy(function(kvArray) {return kvArray[0];} )
                                    .zipObject()
                                    //.value();
                                   // .sortBy(function(val){ return val.username;})
                                    .forEach(function(item,key){
                                        var tmp = _.clone(row);
                                        tmp.gr2 = key;
                                        rows.push(tmp);
                                        var tmpsm = _.clone(rowSum);
                                        item.map(function(r){
                                            _.map(r,function(val,key){
                                                if (key.indexOf('gr')> -1) {
                                                    var tp = scm.filter(function (itm) {
                                                        if (itm.name == key) return itm;
                                                    })[0].type;
                                                    if (tp == 'number')
                                                        r[key] = parseFloat(val);
                                                    else if (tp == 'date')
                                                        r[key] = moment(val).format('DD.MM.YYYY');
                                                }
                                            });

                                            r['nn']=ind;
                                            ind+=1;
                                            rows.push(r);
                                            tmpsm.gr8+=r.gr8;
                                            tmpsm.gr9+=r.gr9;
                                            tmpsm.gr10+=r.gr10;
                                            tmpsm.gr11+=r.gr11;
                                        });
                                        rows.push(tmpsm);
                        }).keys().value();


                        function sortrows(a,b){
                            if(a.username<b.username)
                                return -1;
                            if(a.username>b.username)
                                return 1;
                            return 0;
                        }
                        dbmethods.getUsersArg('users',{'division':'mmo'},function(err,users){
                            if(err)
                            {
                                log.error(err);
                                res.status(500).send("readfile error");
                                return;
                            }
                            users.map(function(user){
                                if(grouped.indexOf(user.username)<0){
                                    var tmp = _.clone(row);
                                    tmp.gr2 = user.username;
                                    rows.push(tmp);
                                }



                            });


                            var values = {
                                date:header_date,
                                grs: rows//.sort(sortrows)
                            };
                            try {
                                template.substitute(sheetNumber, values);
                            }
                            catch(e)
                            {
                                log.error(e);
                            }
                            var doc = template.generate();
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                            res.status(200).end(doc, 'binary');


                        });




                });



        });
    });

}
