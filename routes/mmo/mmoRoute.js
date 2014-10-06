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
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/mmo');
    });

    app.get('/mmo/mmoIndex',isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        res.render('mmo/mmoIndex', {name: req.user.username.slice(0,40)});
    });
}
