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
var vow = require('vow');
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
    res.redirect('/orgm/');
}
module.exports = function (app) {
 app.get('/orgm/orgmIndex',isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        var dbmethods = app.get('dbmethods');
        dbmethods.getUsers('users',function(er,result){
            if (er)
            {
                log.info(er);
                res.status(500).send("Ошибка");
                return;
            } else {
                var users = result.filter(function(user) {if (user.username==req.user.username) return user;});
                res.render('orgm/orgmIndex', {users:JSON.stringify(users), name: req.user.username});}
        });

    });
 app.get('/orgm', function (req, res) {
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
                } else res.render('orgm/orgmLogin', {users:result.filter(function(us) {if(us.division == undefined) return us;}), message: err });
            });
        }
        else res.status(503).send('эта версия браузера не поддерживается,обратитесь к системноу администатору для установки google chrome  <a href="https://www.google.ru/intl/ru/chrome/browser/index.html">https://www.google.ru/intl/ru/chrome/browser/index.html</a>, так же поддерживаются последние версии Opera, Yandex Browser, Safari, FireFox');


    });
 app.post('/orgm/auth', passport.authenticate('local', {failureRedirect: '/orgm?autherr=Неправильный пароль' }), function (req, res) {
        var user = req.body["username"];
        if(user=="Администратор")
        {
            return res.redirect('/orgm/admin');
        }
        else {
            return res.redirect('/orgm/orgmIndex');
        }
    });
 app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/orgm');
    });
 app.post('/orgm/mpr/uploadform',isLoggedIn, function(req, res,next) {
        var dbmethods = app.get('dbmethods');
        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        }


        //req.body.inputdate = convertDatesISO(req.body.inputdate);
        //req.body.rows[0].date = new Date(req.body.rows[0].date);
        dbmethods.insup('orgmMpr',req.body,function (err, results) {
            if (err) {
                log.error(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });

    });
 app.post('/orgm/validateDate',isLoggedIn, function (req, res) {
        var startdate =req.body.startdate;//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
        var enddate = req.body.enddate;
        var username = req.body.username;
        console.log(util.inspect(req.body));

        var dbmethods = app.get('dbmethods');
        var data = {"username":username,"startdate":startdate,"enddate":enddate};
        dbmethods.validateDate1('everyday',data,function(err,result){
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
 app.get('/orgm/admin', isLoggedIn, function (req, res) {
     res.render('orgm/orgmAdmin', {});
 });
 app.get('/orgm/orgmAdimnReport', isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
     fs.readFile(path.join(__dirname, '../../templates/orgm/mprtmpl.xlsx'), function (err, data) {
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
         if (query.type =='mprreport')
            dbmethods.getOrgmMpr('orgmMpr',query.beg,query.end,function(err,result){
             if(err){
                 log.error(err);
                 res.status(500).send(err);
                 return;
             }
                 var rows = [];
                 var sumrow = {'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
                     'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0, 'gr18': 0, 'gr19': 0, 'gr20': 0, 'gr21': 0, 'gr22': 0, 'gr23': 0, 'gr24': 0, 'gr25': 0, 'gr26': 0,
                     'gr27': 0, 'gr28': 0, 'gr29': 0, 'gr30': 0, 'gr31': 0, 'gr32': 0, 'gr33': 0, 'gr34': 0
                 };
                 if (result.length < 1) {
                     res.status(500).send("Нет данных за этот период");
                     return;
                 }
                var beg = moment(parseInt(query.beg));
                var end = moment(parseInt(query.end));

                var header_date="c "+beg.format("DD.MM.YYYY")+" по "+end.format("DD.MM.YYYY");
                var ind=1;
                var promise = result.map(function (item) {
                    return new vow.Promise(function(resolve){
                        if(item._id){

                               if(item._id.group == null) {
                                dbmethods.getUser('users',{username:item._id.user},function(err,us){
                                    item.username = item._id.user;
                                    if(err) item.group='error';
                                    else
                                    item.group = (us.mo.length>1)?us.mo.filter(function(itm){if(itm.fullname==item._id.mo) return itm})[0].group:us.mo[0].group;
                                    item.mo = item._id.mo
                                    item.nn=ind;
                                    ind+=1;
                                    resolve(item);
                                })
                            } else {
                                item.username = item._id.user;
                                item.mo = item._id.mo
                                item.group = item._id.group;
                                item.nn=ind;
                                ind+=1;
                                resolve(item);
                            }
                        };

                    });
                 });
                vow.all(promise).then(function(ress){

                    function sortrows(a,b){
                        if(a.username<b.username)
                            return -1;
                        if(a.username>b.username)
                            return 1;
                        return 0;
                    }

                    var values = {
                        date:header_date,
                        grs: ress//.sort(sortrows)
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
};

