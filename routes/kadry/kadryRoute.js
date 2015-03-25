var url = require('url');
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
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/kadry/');
}
function isAdminIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.role=='admin')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/kadry/');
}
module.exports = function (app) {
 /*   app.get('/kadry', function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        res.render('kadry/kadryIndex', {});
    });
*/
    app.get('/kadry', function (req, res) {
        var browser = req.headers['user-agent'];
        console.log(browser);
        if (browser.indexOf('Chrome')>-1 || browser.indexOf('Safari')>-1 || browser.indexOf('Opera')>-1 || browser.toLowerCase().indexOf('firefox') >-1)
        {
            var url_parts = url.parse(req.url, true);
            var query = url_parts.query;
            var err =[];
            if(query.autherr)  err.push(query.autherr);
            var dbmethods = app.get('dbmethods');
            dbmethods.getUsers('kadry_users',function(er,result){
                if (er)
                {
                    log.info(er);
                    res.status(500).send("Ошибка");
                    return;
                } else {
                    app.set('ucl','kadry_users');

                    res.render('login/login', {action:'/kadry/auth',logintitle:'Отдел кадров',users:result.sort(
                        function(a,b){
                            if(a.username< b.username)
                                return -1;
                            else if(a.username==b.username) return 0
                            else return -0;
                        }
                    ), message: err });}
            });
        }
        else res.status(503).send('эта версия браузера не поддерживается,обратитесь к системноу администатору для установки google chrome  <a href="https://www.google.ru/intl/ru/chrome/browser/index.html">https://www.google.ru/intl/ru/chrome/browser/index.html</a>, так же поддерживаются последние версии Opera, Yandex Browser, Safari, FireFox');


    });
    app.post('/kadry/auth', passport.authenticate('local', {failureRedirect: '/kadry?autherr=Неправильный пароль' }), function (req, res) {
        var user = req.body["username"];
        if(user=="Администратор")
        {
            return res.redirect('/kadry/admin');
        }
        else {
            return res.redirect('/kadry/kadryIndex');
        }
    });
    app.get('/kadry/kadryIndex',isLoggedIn, function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;

        res.render('kadry/kadryIndex', {});

    });
    app.post('/kadry/uploadform',isLoggedIn, function(req, res,next) {
        var dbmethods = app.get('dbmethods');
        if (req.body.hasOwnProperty('_id')) {
            delete req.body._id;
        }

        req.body.inputdate = moment(req.body.inputdate,"DD.MM.YYYY").startOf('day').valueOf();
        //req.body.inputdate = convertDatesISO(req.body.inputdate);
        //req.body.rows[0].date = new Date(req.body.rows[0].date);
        dbmethods.insupOrgm('kadry',req.body,function (err, results) {
            if (err) {
                log.error(err);
                res.status(500).send();
            } else {
                res.status(200).send();
            }
        });

    });
    app.get('/logout', function(req, res){
        req.logout();
        app.set('ucl',undefined);
        res.redirect('http://medicinakubani.ru/lpustat');
    });
}

