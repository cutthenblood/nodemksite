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
var routeUtils = require('./../../util/routeUtils.js');
var rutils = new routeUtils();
module.exports = function (app) {

    app.get('/orgmN', function (req, res) {
        //app.set('division','orgm');
        app.locals.division = 'orgm';
        var dbmethods = app.get('dbmethods');
        dbmethods.queryDb({collection:'users',query:{},project:{'division':1,'username':1,'mo':1},callback:function(err,result){
            if (err)
            {
                log.error(err);
                res.status(500).send("Ошибка");
                return;
            } else {
                var result = {users: result, message: rutils.loginErrors(req.url)};
                return res.status(200).send(JSON.stringify(result)).end();
               // res.render('mksite', {users: result, message: rutils.loginErrors(req.url)});//, {users:result.filter(function(us) {if(us.division == undefined) return us;}), message: err });
            }
        }});
    });
    app.get('/mmoN', function (req, res) {

        app.locals.division = 'mmo';
        var dbmethods = app.get('dbmethods');
        dbmethods.queryDb({collection:'users',query:{},project:{'division':1,'username':1,'mo':1},callback:function(err,result){
            if (err)
            {
                log.error(err);
                res.status(500).send("Ошибка");
                return;
            } else
                res.render('mksite', {users:result
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
                    , message: rutils.loginErrors(req.url) });
        }});
    });

/*    app.get('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
    });*/




    app.post('/auth',function(req, res, next) {
        passport.authenticate('local',
            function(err, user, info) {
                var division = app.locals.division;
                if (err) { return next(err); }
                if (!user)
                    return  res.status(403).send('Wrong password').end();

                req.logIn(user, function(err) {
                    if (err) { return next(err); }
                    return res.status(200).send(user.username).end();
                });

            })(req, res, next);
    });

};