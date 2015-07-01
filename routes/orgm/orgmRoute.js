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
var _ = require('lodash');
var bcrypt   = require('bcrypt-nodejs');
var salt = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
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
function isAdminIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.role=='admin')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/orgm/');
}
module.exports = function (app) {
// app.get('/orgm/orgmIndex',isLoggedIn, function (req, res) {
//        var url_parts = url.parse(req.url, true);
//        var query = url_parts.query;
//
//        var dbmethods = app.get('dbmethods');
//        dbmethods.getUsers('users',function(er,result){
//            if (er)
//            {
//                log.info(er);
//                res.status(500).send("Ошибка");
//                return;
//            } else {
//                var users = result.filter(function(user) {if (user.username==req.user.username) return user;});
//                res.render('orgm/orgmIndex', {users:JSON.stringify(users), name: req.user.username});}
//        });
//
//    });
// app.get('/orgm', function (req, res) {
//        var browser = req.headers['user-agent'];
//        console.log(browser);
//        if (browser.indexOf('Chrome')>-1 || browser.indexOf('Safari')>-1 || browser.indexOf('Opera')>-1 || browser.toLowerCase().indexOf('firefox') >-1)
//        {
//            var url_parts = url.parse(req.url, true);
//            var query = url_parts.query;
//            var err =[];
//            if(query.autherr)  err.push(query.autherr);
//            var dbmethods = app.get('dbmethods');
//            dbmethods.getUsers('users',function(er,result){
//                if (er)
//                {
//                    log.info(er);
//                    res.status(500).send("Ошибка");
//                    return;
//                } else {
//
//                    res.render('login/login', {action:'/orgm/auth',logintitle:'Организационно-методический отдел',users:result.filter(function(us) {if(us.division == undefined) return us;}).sort(
//                        function(a,b){
//                            if(a.username< b.username)
//                                return -1;
//                            else if(a.username==b.username) return 0;
//                            else return 1;
//                        }
//                    ), message: err });}
//            });
//        }
//        else res.status(503).send('эта версия браузера не поддерживается,обратитесь к системноу администатору для установки google chrome  <a href="https://www.google.ru/intl/ru/chrome/browser/index.html">https://www.google.ru/intl/ru/chrome/browser/index.html</a>, так же поддерживаются последние версии Opera, Yandex Browser, Safari, FireFox');
//
//
//    });
// app.post('/orgm/auth', passport.authenticate('local', {failureRedirect: '/orgm?autherr=Неправильный пароль' }), function (req, res) {
//        var user = req.body["username"];
//        if(user=="Администратор")
//        {
//             return res.redirect('/orgm/admin');
//        }
//        else {
//            return res.redirect('/orgm/orgmIndex');
//        }
//    });
// app.delete('/logout', function(req, res){
//        req.logout();
//         res.status(200).send('logout');
//
//    });
// app.post('/orgm/mpr/uploadform',isLoggedIn, function(req, res,next) {
//        var dbmethods = app.get('dbmethods');
//        if (req.body.hasOwnProperty('_id')) {
//            delete req.body._id;
//        }
//
//req.body.inputdate = moment(req.body.inputdate,"DD.MM.YYYY").startOf('day').valueOf();
//        //req.body.inputdate = convertDatesISO(req.body.inputdate);
//        //req.body.rows[0].date = new Date(req.body.rows[0].date);
//        dbmethods.insupOrgm('orgmMpr',req.body,function (err, results) {
//            if (err) {
//                log.error(err);
//                res.status(500).send();
//            } else {
//                res.status(200).send();
//            }
//        });
//
//    });
// app.post('/orgm/mprPD/uploadform',isLoggedIn, function(req, res,next) {
//        var dbmethods = app.get('dbmethods');
//        if (req.body.hasOwnProperty('_id')) {
//            delete req.body._id;
//        }
//
//        req.body.inputdate = moment(req.body.inputdate,"DD.MM.YYYY").startOf('day').valueOf();
//        //req.body.inputdate = convertDatesISO(req.body.inputdate);
//        //req.body.rows[0].date = new Date(req.body.rows[0].date);
//        dbmethods.insupOrgm('orgmMprPD',req.body,function (err, results) {
//            if (err) {
//                log.error(err);
//                res.status(500).send();
//            } else {
//                res.status(200).send();
//            }
//        });
//
//    });
//    //todo заточить под разные отчеты
// app.post('/orgm/validateDate',isLoggedIn, function (req, res) {
//        var startdate =req.body.startdate;//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
//        var enddate = req.body.enddate;
//        var mo = req.body.mo;
//        var type = req.body.type;
//        console.log(util.inspect(req.body));
//
//        var dbmethods = app.get('dbmethods');
//        var data = {"mo":mo.replace(/ {2,}/g,' '),"startdate":startdate,"enddate":startdate};
//        var collection = '';
//        switch (type){
//            case 'mpr': collection = 'orgmMpr';break;
//            case 'mprPD': collection = 'orgmMprPD';break;
//
//        }
//        dbmethods.validateDate1(collection,data,function(err,result){
//            if (err)
//            {
//                log.info(err);
//                res.status(500).send("Ошибка");
//                return;
//            }
//
//            if(result.length<1)
//            {
//                console.log("ok");
//                res.status(200).send("ok");
//            }
//            else
//            {
//                if ('rows' in result[0])
//                {
//                    console.log("no");
//                    res.status(200).send("no");
//
//                } else {
//                    console.log("ok");
//                    res.status(200).send("ok");
//                }
//            }
//        });
//    });
//
// app.post('/orgm/mpremptydates',isLoggedIn, function (req, response) {
//     var startdate =req.body.startdate;//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
//     var enddate = req.body.enddate;
//     var end = moment(parseInt(enddate)).add('days',1);
//     var user = req.body.username;
//     var type = req.body.type;
//     var collection = '';
//     switch (type){
//         case 'mpr': collection = 'orgmMpr';break;
//         case 'mprPD': collection = 'orgmMprPD';break;
//
//     }
//     var dbmethods = app.get('dbmethods');
//     var res = [];
//     dbmethods.getOrgmMprEmptyDates(collection,startdate,enddate,user,function(err,result) {
//         if (err) {
//             log.info(err);
//             res.status(500).send("Ошибка");
//             return;
//         }
//         if (result.length > 0) {
//             var cur= moment(parseInt(startdate));
//             while (cur.valueOf()<end.valueOf()) {
//                 var rs = result.filter(function(itm){
//                     if(moment(itm.date).format('DD.MM.YYYY')==cur.format('DD.MM.YYYY'))
//                        return itm;
//                 });
//                 if(rs.length<1)
//                     res.push({user:req.body.username,date:cur.format('DD.MM.YYYY')});
//                 cur = cur.add(1,'days');
//             }
//             console.log("ok");
//
//         } else
//         {
//             var cur= moment(parseInt(startdate));
//             while (cur.valueOf()<end.valueOf()) {
//                 res.push({user:req.body.username,date:cur.format('DD.MM.YYYY')});
//                 cur = cur.add(1,'days');
//             }
//
//             console.log("no");
//
//         }
//         response.send(JSON.stringify(res.sort(function(a,b){
//             return moment(a.date,'DD.MM.YYYY').diff(moment(b.date,'DD.MM.YYYY'));
//         }))).end();
//
//     });
//
//
// });
//
// app.post('/orgm/mprwhoinput',isLoggedIn, function (req, response) {
//        var startdate =req.body.startdate;//var seldate = moment(query.date,"DD.MM.YYYY").format("DD.MM.YYYY");
//        var enddate = req.body.enddate;
//     var end = moment(parseInt(enddate)).add('days',1);
//        var user = req.body.username;
//        var dbmethods = app.get('dbmethods');
//
//        dbmethods.getOrgmMprWhoInput('orgmMpr',startdate,end.valueOf(),function(err,result){
//            if (err)
//            {
//                log.info(err);
//                res.status(500).send("Ошибка");
//                return;
//            }
//            if(result.length>0)
//            {
//                dbmethods.getUsersArg('users',{"division":{$exists:false}},function(err,users){
//                    if (err)
//                    {
//                        log.info(err);
//                        res.status(500).send("Ошибка");
//                        return;
//                    }
//                    var gbd = _.groupBy(result,function(item){
//                        return moment(item.date).format('DD.MM.YYYY');
//                    });
//
//                    var res = [];
//                    var start = moment(parseInt(startdate));
//
//
//                    users.map(function(user){
//                        if('mo' in user)
//                            user.mo.map(function(moo){
//                                var cur= moment(parseInt(startdate));
//                                while (cur.valueOf()!=end.valueOf()) {
//                                    var curorgs = gbd[cur.format('DD.MM.YYYY')];
//                                    if (curorgs){
//                                        var rs = curorgs.filter(function(curorg){
//                                            if (curorg.mo == moo.fullname.replace(/ {2,}/g,' '))
//                                                return curorg;
//                                                });
//                                        if(rs.length<1){
//                                            res.push({mo:moo.fullname.replace(/ {2,}/g,' '),date:cur.format('DD.MM.YYYY')});
//                                        }
//                                    } else {
//                                        res.push({mo:'нет',date:cur.format('DD.MM.YYYY')});
//                                    }
//                                        cur = cur.add('days',1);
//                                    }
//                            })
//                    });
//
//
//
//
//
//                    console.log("ok");
//                    response.send(JSON.stringify(res.sort(function(a,b){
//                        return moment(a.date,'DD.MM.YYYY').diff(moment(b.date,'DD.MM.YYYY'));
//                    }))).end();
//
//
//
//                });
//
//
//
//            }
//            else
//            {
//                console.log("no");
//                res.status(200).send([]);
//            }
//        });
//    });
// app.get('/orgm/admin', isAdminIn, function (req, res) {
//     res.render('orgm/orgmAdmin', {});
//
//
// });
// app.get('/orgm/getusers',isLoggedIn, function (req, response) {
//        var dbmethods = app.get('dbmethods');
//        dbmethods.getUsers('users', function (er, result) {
//            if (er) {
//                log.info(er);
//                response.status(500).send("Ошибка");
//                return;
//            } else response.send(JSON.stringify(result.filter(function(us) {if(us.division == undefined && us.username!='Администратор' && ('mo' in us)) return us;})));
//        });
//    });
// app.get('/orgm/orgmAdimnReport/:reportData', isAdminIn, function (req, res) {
//
//     var query = JSON.parse(req.params.reportData);
//
//
//         var dbmethods = app.get('dbmethods');
//         if (query.monitoring == 'mpr'){
//
//             fs.readFile(path.join(__dirname, '../../templates/orgm/mprtmpl.xlsx'), function (err, data) {
//                 if(err)
//                 {
//                     console.log(err);
//                     res.status(500).send("readfile error");
//                     return;
//                 }
//
//                 try {
//                     var template = new XlsxTemplate(data);
//                     var sheetNumber = 1;
//                 }
//                 catch(e)
//                 {
//                     console.log(e);
//                 }
//                 if (query.type =='mprreport')
//                     dbmethods.getOrgmMpr('orgmMpr',query.beg,query.end,function(err,result){
//                         if(err){
//                             log.error(err);
//                             res.status(500).send(err);
//                             return;
//                         }
//                         var rows = [];
//                         var sumrow = {'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
//                             'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0, 'gr18': 0, 'gr19': 0, 'gr20': 0, 'gr21': 0, 'gr22': 0, 'gr23': 0, 'gr24': 0, 'gr25': 0, 'gr26': 0,
//                             'gr27': 0, 'gr28': 0, 'gr29': 0, 'gr30': 0, 'gr31': 0, 'gr32': 0, 'gr33': 0, 'gr34': 0, 'gr35': 0
//                         };
//                         if (result.length < 1) {
//                             res.status(500).send("Нет данных за этот период");
//                             return;
//                         }
//                         var beg = moment(parseInt(query.beg));
//                         var end = moment(parseInt(query.end));
//
//                         var header_date="c "+beg.format("DD.MM.YYYY")+" по "+end.format("DD.MM.YYYY");
//                         var ind=1;
//                         result.sort(function(a,b){
//                             if(a._id.user<b._id.user)
//                                 return -1;
//                             if(a._id.user>b._id.user)
//                                 return 1;
//                             return 0;
//
//                         });
//                         var promise = result.map(function (item) {
//                             return new vow.Promise(function(resolve){
//                                 if(item._id){
//
//                                     if(item._id.group == null) {
//                                         dbmethods.getUser('users',{username:item._id.user.replace(/ {2,}/g,' ')},function(err,us){
//                                             item.username = item._id.user;
//
//                                             if(err) {console.log(err);
//                                                 item.group='error';}
//                                             else
//                                                 item.group = (us.mo.length>1)?us.mo.filter(function(itm){if(itm.fullname.replace(/ {2,}/g,' ')==item._id.mo.replace(/ {2,}/g,' ')) return itm})[0].group:us.mo[0].group;
//                                             item.mo = item._id.mo.replace(/ {2,}/g,' ');
//                                             //item.nn=ind;
//                                             item.gr7 = Math.round((parseFloat(item.gr6)*100)/parseFloat(item.gr5));
//                                             if(item.gr7.toString()=='NaN') item.gr7=0;
//                                             ind+=1;
//                                             resolve(item);
//                                         })
//                                     } else {
//                                         item.username = item._id.user;
//                                         item.mo = item._id.mo.replace(/ {2,}/g,' ');
//                                         item.group = item._id.group;
//                                         // item.nn=ind;
//                                         //ind+=1;
//                                         resolve(item);
//                                     }
//                                 };
//
//                             });
//                         });
//                         vow.all(promise).then(function(ress){
//                             var ind =1 ;
//                             ress.map(function(item){
//                                 item.nn=ind;
//                                 ind+=1;
//                             });
//                             /*dbmethods.getUsersArg('users',{'division':'mmo'},function(err,users) {
//                              if (err) {
//                              log.error(err);
//                              res.status(500).send("readfile error");
//                              return;
//                              }*/
//
//
//                             var values = {
//                                 date: header_date,
//                                 grs: ress//.sort(sortrows)
//                             };
//                             try {
//                                 template.substitute(sheetNumber, values);
//                             }
//                             catch (e) {
//                                 log.error(e);
//                             }
//                             var doc = template.generate();
//                             res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//                             res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//                             res.status(200).end(doc, 'binary');
//                             // });
//
//                         });
//
//                     });
//                 else if (query.type == 'mprone')
//                     dbmethods.getOrgmMprOne('orgmMpr',query.beg,query.end,query.mo,function(err,result){
//                         if(err){
//                             log.error(err);
//                             res.status(500).send(err);
//                             return;
//                         }
//                         var rows = [];
//
//                         if (result.length < 1) {
//                             res.status(500).send("Нет данных за этот период");
//                             return;
//                         }
//                         var beg = moment(parseInt(query.beg));
//                         var end = moment(parseInt(query.end));
//
//                         var header_date="MO - "+query.mo+"c "+beg.format("DD.MM.YYYY")+" по "+end.format("DD.MM.YYYY");
//                         var ind=1;
//                         result.sort(function(a,b){
//                             return parseInt(a.inputdate)-parseInt(b.inputdate);
//                         });
//
//
//                         var ind =1 ;
//                         /*var result={'nn':0,'username':'','gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
//                          'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0, 'gr18': 0, 'gr19': 0, 'gr20': 0, 'gr21': 0, 'gr22': 0, 'gr23': 0, 'gr24': 0, 'gr25': 0, 'gr26': 0,
//                          'gr27': 0, 'gr28': 0, 'gr29': 0, 'gr30': 0, 'gr31': 0, 'gr32': 0, 'gr33': 0, 'gr34': 0, 'gr35': 0
//                          };*/
//                         var rss=[];
//                         result.map(function(item){
//                             item.rows.gr7 = Math.round((parseFloat(item.rows.gr6)*100)/parseFloat(item.rows.gr5));
//                             if(item.rows.gr7.toString()=='NaN') item.rows.gr7=0;
//                             var tmp = {'nn':ind};
//                             _.extend(tmp,item.rows);
//                             tmp.username=moment(parseInt(item.inputdate)).format('DD.MM.YYYY');
//                             rss.push(tmp);
//                             ind+=1;
//                         });
//                         /*dbmethods.getUsersArg('users',{'division':'mmo'},function(err,users) {
//                          if (err) {
//                          log.error(err);
//                          res.status(500).send("readfile error");
//                          return;
//                          }*/
//
//
//                         var values = {
//                             date: header_date,
//                             grs: rss//.sort(sortrows)
//                         };
//                         try {
//                             template.substitute(sheetNumber, values);
//                         }
//                         catch (e) {
//                             console.log(e);
//                         }
//                         var doc = template.generate();
//                         res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//                         res.setHeader("Content-Disposition", "attachment; filename=Report.xlsx");
//                         res.status(200).end(doc,'binary');
//                         // });
//
//
//
//                     });
//
//
//             });
//
//         }
//         if (query.monitoring == 'mprPD'){
//         fs.readFile(path.join(__dirname, '../../templates/orgm/mprpdtmpl.xlsx'), function (err, data) {
//             if (err) {
//                 console.log(err);
//                 res.status(500).send("readfile error");
//                 return;
//             }
//
//             try {
//                 var template = new XlsxTemplate(data);
//                 var sheetNumber = 1;
//             }
//             catch (e) {
//                 console.log(e);
//             }
//             if (query.type =='mprreport')
//                 dbmethods.getOrgmMprPD('orgmMprPD',query.beg,query.end,function(err,result){
//                     if(err){
//                         log.error(err);
//                         res.status(500).send(err);
//                         return;
//                     }
//                     var rows = [];
//                     var sumrow = {'gr4': 0,'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
//                         'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0
//                     };
//                     if (result.length < 1) {
//                         res.status(500).send("Нет данных за этот период");
//                         return;
//                     }
//                     var beg = moment(parseInt(query.beg));
//                     var end = moment(parseInt(query.end));
//
//                     var header_date="c "+beg.format("DD.MM.YYYY")+" по "+end.format("DD.MM.YYYY");
//                     var ind=1;
//                     result.sort(function(a,b){
//                         if(a._id.user<b._id.user)
//                             return -1;
//                         if(a._id.user>b._id.user)
//                             return 1;
//                         return 0;
//
//                     });
//                     var promise = result.map(function (item) {
//                         return new vow.Promise(function(resolve){
//                             if(item._id){
//                                 item.period = moment(item.inputdate).format("MM.YYYY");
//                                 item.gr6 = (parseInt(item.gr5)*100)/parseInt(item.gr4);
//                                 item.gr9 = (parseInt(item.gr8)*100)/parseInt(item.gr7);
//                                 item.gr12 = (parseInt(item.gr11)*100)/parseInt(item.gr7);
//                                 item.gr15 = (parseInt(item.gr14)*100)/parseInt(item.gr13);
//                                 dbmethods.getUser('users',{username:item._id.user.replace(/ {2,}/g,' ')},function(err,us){
//                                         item.username = item._id.user;
//                                         item.mo = item._id.mo.replace(/ {2,}/g,' ');
//                                         ind+=1;
//                                         resolve(item);
//                                     })
//                             };
//
//
//                         });
//                     });
//                     vow.all(promise).then(function(ress){
//                         var ind =1 ;
//                         ress.map(function(item){
//                             item.nn=ind;
//                             ind+=1;
//                         });
//
//                         var values = {
//                             date: header_date,
//                             grs: ress//.sort(sortrows)
//                         };
//                         try {
//                             template.substitute(sheetNumber, values);
//                         }
//                         catch (e) {
//                             log.error(e);
//                         }
//                         var doc = template.generate();
//                         res.setHeader('Content-Type', 'application/vnd.openxmlformats');
//                         res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
//                         res.status(200).end(doc, 'binary');
//                         // });
//
//                     });
//
//                 });
//            // else if (query.type == 'mprone')
//         });
//
//     }
//
//
//
//    });
    //-------------------new-------------------------
    app.post('/orgm/users', function (req, res) {
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
                } else {
                    res.send(JSON.stringify(result.filter(function (us) {
                        if (us.division == undefined) return us;
                    }).sort(
                        function (a, b) {
                            if (a.username < b.username)
                                return -1;
                            else if (a.username == b.username) return 0;
                            else return 1;
                        }
                    ))).end();
                }

            });
        }
        else res.status(503).send('эта версия браузера не поддерживается,обратитесь к системноу администатору для установки google chrome  <a href="https://www.google.ru/intl/ru/chrome/browser/index.html">https://www.google.ru/intl/ru/chrome/browser/index.html</a>, так же поддерживаются последние версии Opera, Yandex Browser, Safari, FireFox');


    });
    app.get('/orgmMM', function (req, res) {
        res.render('orgm/orgmView', {});
    });
    app.get('/orgm/isLoggendIn',function(req,res){

        if(req.user){
        var user = _.clone(req.user, true);
            user.role = req.user.role;
        console.log(user.role);
        user.password = 'guess!!';
        res.send(req.isAuthenticated() ? user : '0');}
        else
        res.send('0');
    });
    app.post('/orgm/authMM', passport.authenticate('local'), function (req, res) {
        if(req.user){
            var user = _.clone(req.user, true);
            user.role = req.user.role;
            user.password = 'guess!!';
            res.send(req.isAuthenticated() ? user : '0');}
        else
            res.send('0');

    });
    app.post('/orgm/save',isLoggedIn, function(req, res,next) {
        var dbmethods = app.get('dbmethods');
        var type = req.body.type;
        delete req.body.type;
        delete req.body.info;
        delete req.body.table;
        delete req.body.user;

        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        }
        req.body.inputdate = parseInt(req.body.inputdate);
        var collection='';
        if(type == 'mpr')
            collection = 'orgmMpr';
        if(type == 'mprPD')
            collection = 'orgmMprPD';
        if(type == 'deathm')
            collection = 'everyday';
        dbmethods.insupOrgm(collection,req.body,function (err, results) {
            if (err) {
                log.error(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });

    });
    app.post('/orgm/whoinput',isLoggedIn, function (req, response) {

        var start =parseInt(req.body.start);
        var end = parseInt(req.body.end);
        var type = req.body.type;
        var user = req.body.username;
        var mo = req.body.mo;
        var dbmethods = app.get('dbmethods');
        var collection = '';

        var data = {startdate:start,stopdate:end,callback:function(err,result){
            if (err)
            {
                log.info(err);
                res.status(500).send("Ошибка");
                return;
            }
            if(result.length>0)
            {
                var keys = _.keys(result[0]);
                var curdate = start;

                while (curdate<=end){
                    console.log(moment(curdate).format('DD.MM.YYYY'));
                    var dtin = _.findIndex(result,function(itm){
                        return itm.inputdate == curdate;
                    });
                    if(dtin<0){
                          var row = {inputdate:curdate,rows:{}};
                        _.forEach(result[0].rows,function(n,key){
                            row.rows[key] = '-';
                            row.rows.username = user;
                            row.rows.mo = mo;
                        });
                        result.push(row);
                    }
                    if(['mpr','deathm'].indexOf(type)>=0)
                        curdate = moment(curdate).add(24, 'h').valueOf();
                    if(type=='mprPD')
                        curdate = moment(curdate).add(1, 'M').valueOf();
                }
                response.send(JSON.stringify(_.sortBy(result,function(itm){
                    return itm.inputdate;
                })));
            }
            else
            {
                console.log("no");
                response.status(200).send([]);
            }
        }};
        if(type == 'mpr'){
            data.collection = 'orgmMpr';
            data.mo = mo;}
        else if(type == 'mprPD'){
            data.collection = 'orgmMprPD';
            data.mo = mo;
        }
        else if(type == 'deathm'){
            data.collection = 'everyday';
            data.username = mo;
        }


        dbmethods.getOrgmWhoInput(data);

    });
    app.post('/orgm/checkDate',isLoggedIn, function (req, response) {

        var date =parseInt(req.body.date);
        var type = req.body.type;
        var mo = req.body.mo;

        var data;
        data = {date: date};

        if(type == 'mpr'){
            data.mo=mo;
            data.collection = 'orgmMpr'
        }
        else if (type =='mprPD'){
            data.mo=mo;
            data.collection = 'orgmMprPD'
        }
        else if(type == 'deathm') {
            data.collection = 'everyday';
            data.username = req.user.username;
        }
        var dbmethods = app.get('dbmethods');

       data.callback= function (err,result){
            if (err)
            {
                console.log(err);
                res.status(500).send("Ошибка");
                return;
            }
            if(result.length>0)

            {
                console.log(1);
                response.send("1");
            }
            else
            {
                console.log("no");
                response.send("0");
            }
        };

        dbmethods.checkDate(data);

    });
    app.get('/orgm/report/:reportData',isAdminIn,function(req,resp){
        console.log('report route');
        var query = JSON.parse(req.params.reportData);
        console.log(query);
        var start =parseInt(query.start);
        var end = parseInt(query.end);
        var type = query.type;
        var user = query.username;
        var mo = query.mo;
        var raisingsum = "false";
        var all = query.all;
        var dbmethods = app.get('dbmethods');


        if (type == 'mpr' ){
//todo us.mo нет у всех user
            fs.readFile(path.join(__dirname, '../../templates/orgm/mprtmpl.xlsx'), function (err, data) {
                if(err)
                {
                    console.log(err);
                    resp.status(500).send("readfile error");
                    return;
                }

                try {
                    var template = new XlsxTemplate(data);
                    var sheetNumber = 1;
                }
                catch(e)
                {
                    console.log(e);
                }
                if (all==true)
                    dbmethods.getOrgmMpr('orgmMpr',start,end,function(err,result){
                        if(err){
                            log.error(err);
                            resp.status(500).send(err);
                            return;
                        }
                        var rows = [];
                        var sumrow = {'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
                            'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0, 'gr18': 0, 'gr19': 0, 'gr20': 0, 'gr21': 0, 'gr22': 0, 'gr23': 0, 'gr24': 0, 'gr25': 0, 'gr26': 0,
                            'gr27': 0, 'gr28': 0, 'gr29': 0, 'gr30': 0, 'gr31': 0, 'gr32': 0, 'gr33': 0, 'gr34': 0, 'gr35': 0
                        };
                        if (result.length < 1) {
                            resp.status(500).send("Нет данных за этот период");
                            return;
                        }
                        var begm = moment(start);
                        var endm = moment(end);

                        var header_date="c "+begm.format("DD.MM.YYYY")+" по "+endm.format("DD.MM.YYYY");
                        var ind=1;
                        result.sort(function(a,b){
                            if(a._id.user<b._id.user)
                                return -1;
                            if(a._id.user>b._id.user)
                                return 1;
                            return 0;

                        });
                        var promise = result.map(function (item) {
                            return new vow.Promise(function(resolve){
                                if(item._id){

                                    if(item._id.group == null) {
                                        dbmethods.getUser('users',{username:item._id.user.replace(/ {2,}/g,' ')},function(err,us){
                                            item.username = item._id.user;

                                            if(err) {console.log(err);
                                                item.group='error';}
                                            else  {
                                                if('mo' in us)
                                                    item.group = (us.mo.length > 1) ? us.mo.filter(function (itm) {
                                                        if (itm.fullname.replace(/ {2,}/g, ' ') == item._id.mo.replace(/ {2,}/g, ' ')) return itm
                                                    })[0].group : us.mo[0].group;
                                                item.mo = item._id.mo.replace(/ {2,}/g, ' ');
                                                //item.nn=ind;
                                                item.gr7 = Math.round((parseFloat(item.gr6) * 100) / parseFloat(item.gr5));
                                                if (item.gr7.toString() == 'NaN') item.gr7 = 0;
                                                ind += 1;
                                                resolve(item);
                                            }

                                        })
                                    } else {
                                        item.username = item._id.user;
                                        item.mo = item._id.mo.replace(/ {2,}/g,' ');
                                        item.group = item._id.group;
                                        // item.nn=ind;
                                        //ind+=1;
                                        resolve(item);
                                    }
                                };

                            });
                        });
                        vow.all(promise).then(function(ress){
                            var ind =1 ;
                            ress.map(function(item){
                                item.nn=ind;
                                ind+=1;
                            });

                            var values = {
                                date: header_date,
                                grs: ress//.sort(sortrows)
                            };
                            try {
                                template.substitute(sheetNumber, values);
                            }
                            catch (e) {
                                log.error(e);
                            }
                            var doc = template.generate();
                            resp.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            resp.setHeader("Content-Disposition", "attachment; filename=Report_"+begm.format("DD.MM.YYYY")+"-"+endm.format("DD.MM.YYYY")+".xlsx");
                            resp.status(200).end(doc, 'binary');

                        });

                    });
                else
                if (all== false)
                    dbmethods.getOrgmMprOne('orgmMpr',start,end,query.mo,function(err,result){
                        if(err){
                            log.error(err);
                            resp.status(500).send(err);
                            return;
                        }
                        var rows = [];

                        if (result.length < 1) {
                            resp.status(500).send("Нет данных за этот период");
                            return;
                        }
                        var begm = moment(parseInt(query.beg));
                        var endm = moment(parseInt(query.end));

                        var header_date="MO - "+query.mo+"c "+begm.format("DD.MM.YYYY")+" по "+endm.format("DD.MM.YYYY");
                        var ind=1;
                        result.sort(function(a,b){
                            return parseInt(a.inputdate)-parseInt(b.inputdate);
                       });
                        var ind =1 ;
                        var rss=[];
                        result.map(function(item){
                            item.rows.gr7 = Math.round((parseFloat(item.rows.gr6)*100)/parseFloat(item.rows.gr5));
                            if(item.rows.gr7.toString()=='NaN') item.rows.gr7=0;
                            var tmp = {'nn':ind};
                            _.extend(tmp,item.rows);
                            tmp.username=moment(parseInt(item.inputdate)).format('DD.MM.YYYY');
                            rss.push(tmp);
                            ind+=1;
                        });
                        var values = {
                            date: header_date,
                            grs: rss//.sort(sortrows)
                        };
                        try {
                            template.substitute(sheetNumber, values);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        var doc = template.generate();
                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats');
                        resp.setHeader("Content-Disposition", "attachment; filename=Report_"+begm.format("DD.MM.YYYY")+"-"+endm.format("DD.MM.YYYY")+".xlsx");
                        resp.status(200).end(doc,'binary');
                    });
            });

        }
        if (type == 'mprPD'){
            fs.readFile(path.join(__dirname, '../../templates/orgm/mprpdtmpl.xlsx'), function (err, data) {
                if (err) {
                    console.log(err);
                    resp.status(500).send("readfile error");
                    return;
                }

                try {
                    var template = new XlsxTemplate(data);
                    var sheetNumber = 1;
                }
                catch (e) {
                    console.log(e);
                }
                dbmethods.getOrgmMprPD('orgmMprPD',start,end,function(err,result){
                        if(err){
                            log.error(err);
                            resp.status(500).send(err);
                            return;
                        }
                        var rows = [];
                        var sumrow = {'gr4': 0,'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
                            'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0
                        };
                        if (result.length < 1) {
                            resp.status(500).send("Нет данных за этот период");
                            return;
                        }
                        var begm = moment(start);
                        var endm = moment(end);

                        var header_date="c "+begm.format("DD.MM.YYYY")+" по "+endm.format("DD.MM.YYYY");
                        var ind=1;
                        result.sort(function(a,b){
                            if(a._id.inputdate == b._id.inputdate)
                                if(a._id.user<b._id.user)
                                    return -1;
                                else if(a._id.user>b._id.user)
                                    return 1;
                                else return 0;
                            else
                                return a._id.inputdate - b._id.inputdate

                        });
                        var promise = result.map(function (item) {
                            return new vow.Promise(function(resolve){
                                if(item._id){
                                    item.period = moment(item._id.inputdate).format("MM.YYYY");
                                    item.gr6 = (parseInt(item.gr5)*100)/parseInt(item.gr4);
                                    item.gr9 = (parseInt(item.gr8)*100)/parseInt(item.gr7);
                                    item.gr12 = (parseInt(item.gr11)*100)/parseInt(item.gr7);
                                    item.gr15 = (parseInt(item.gr14)*100)/parseInt(item.gr13);
                                    dbmethods.getUser('users',{username:item._id.user.replace(/ {2,}/g,' ')},function(err,us){
                                        item.username = item._id.user;
                                        item.mo = item._id.mo.replace(/ {2,}/g,' ');
                                        ind+=1;
                                        resolve(item);
                                    })
                                };
                            });
                        });
                        vow.all(promise).then(function(ress){
                            var ind =1 ;
                            ress.map(function(item){
                                item.nn=ind;
                                ind+=1;
                            });

                            var values = {
                                date: header_date,
                                grs: ress//.sort(sortrows)
                            };
                            try {
                                template.substitute(sheetNumber, values);
                            }
                            catch (e) {
                                log.error(e);
                            }
                            var doc = template.generate();
                            resp.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            resp.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                            resp.status(200).end(doc, 'binary');
                        });
                    });

            });

        }
        if (type == 'deathm'){
            var seldate  =moment(start,"DD.MM.YYYY").format("DD.MM.YYYY");
            fs.readFile(path.join(__dirname, '../../templates/tmpl.xlsx'), function (err, data) {
                if(err)
                {
                    log.error(err);
                    resp.status(500).send("readfile error");
                    return;
                }

                try {
                    var template = new XlsxTemplate(data);
                    var sheetNumber = 10;
                }
                catch(e)
                {
                    log.error(e);
                }
                function gendoc(err,result)
                {
                    if(err){
                        log.error(err);
                        resp.status(500).send(err);
                        return;
                    }
                    else {
                        var rows = [];
                        var sumrow = {'gr2': 0, 'gr3': 0, 'gr4': 0, 'gr5': 0, 'gr6': 0, 'gr7': 0, 'gr8': 0, 'gr9': 0, 'gr10': 0, 'gr11': 0, 'gr12': 0, 'gr13': 0,
                            'gr14': 0, 'gr15': 0, 'gr16': 0, 'gr17': 0, 'gr18': 0, 'gr19': 0, 'gr20': 0, 'gr21': 0, 'gr22': 0, 'gr23': 0, 'gr24': 0, 'gr25': 0, 'gr26': 0,
                            'gr27': 0, 'gr28': 0, 'gr29': 0, 'gr30': 0, 'gr31': 0, 'gr32': 0, 'gr33': 0
                        };
                        if (result.length < 1) {
                            resp.status(500).send("Нет данных за этот день");
                            return;
                        }
                        var resset = [];
                        var header_date="";
                        if(!result[0].rows){
                            resset=result;

                            header_date="c 01.01.2014 по "+seldate;
                        }
                        else
                        {
                            resset = result[0].rows;
                            header_date="за "+seldate;
                        }
                        resset.forEach(function (item) {
                            var date = seldate;
                            if(item._id)
                                item.username = item._id;
                            rows.push(item);
                            for (var key in sumrow) {
                                sumrow[key] += item[key];
                            }
                        });

                        var sumres = [sumrow];
                        function sortrows(a,b){
                            if(a.username<b.username)
                                return -1
                            if(a.username>b.username)
                                return 1
                            return 0
                        }

                        var values = {
                            date:header_date,
                            grs: rows.sort(sortrows),
                            sgrs: sumres
                        };
                        try {
                            template.substitute(sheetNumber, values);
                        }
                        catch(e)
                        {
                            log.error(e);
                        }
                        var doc = template.generate();
                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats');
                        resp.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                        resp.status(200).end(doc, 'binary');
                    }

                }

                if(raisingsum=="false")

                {

                    dbmethods.getByInputDate('everyday', start,gendoc);
                }
                else
                {
                    dbmethods.getRaisingSum('everyday',"01.01.2014",start,gendoc);
                }


            });

        }
    })
    app.get('/orgmRjs', function (req, res) {
        var browser = req.headers['user-agent'];
        if (browser.indexOf('Chrome') > 0 || browser.indexOf('CriOS') > 0)
            res.render('mksite', {appfolder:'app/main'});
        else
            res.render('browser', {});

        //res.render('mksite', {});
    });

};

