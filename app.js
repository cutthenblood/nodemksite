var express = require('express');
var pathbuiledr = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var log = require('./log.js')(module);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var vow = require('vow');
//var requireDir = require('require-dir');
var router = express.Router();
var mongodb = require('mongodb');
var dbfactory = require('./db');
var cons = require('consolidate');
var auth = require('./passport.js');
var passport = require('passport');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var conf = require('./config.js');

var toobusy = require('toobusy');

//var routes = require('./routes/phonelist/phonelist');
//var phonelist = require('./routes/phonelist/getUserPhoneList');
//var bcrypt   = require('bcrypt-nodejs');
//var pass = bcrypt.hashSync("Erkd#923", bcrypt.genSaltSync(10), null);
//var dir = requireDir('./views', {recurse: true});


//console.log(bcrypt.hashSync('admin_8921', bcrypt.genSaltSync(10), null)+'');

var ipban = require('./ipban.js');
var app = express();

app.set('conf', conf);
app.use(session({
    store: new RedisStore({ host: conf.session.redis.host, port: conf.session.redis.port, ttl: 604800 }),
    secret: conf.session.secret,
    key: 'session',
    cookie: { maxAge: 604800000 },
    fail: function (data, accept) {
        accept(null, true);
    },
    success: function (data, accept) {
        accept(null, true);
    }}));

app.set('router',express.Router());
app.use(ipban('on'));
// view engine setup
var viewspath = pathbuiledr.join(__dirname, 'views');

app.set('views',viewspath);
app.engine('ejs',cons.lodash);
app.set('view engine', 'ejs');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(pathbuiledr.join(__dirname, 'public')));
app.use(express.static(pathbuiledr.join(__dirname, 'bower_components')));


app.use(function (err, req, res, next) {
    console.log("this one ");
    res.status(500).send("Ooops!!");
});
function mongoConnectPromise(connectionString) {
    return new vow.Promise(function (resolve, reject, notify) {
        var MongoClient = mongodb.MongoClient;
        MongoClient.connect(connectionString, function (err, db) {
            if (err) {
                log.error(err);
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}

function routePromise(router, path) {
    app.use(passport.initialize());
    app.use(passport.session());
    return new vow.Promise(function (resolve, reject) {
        function dirtree(path, chunk) {
            var files = fs.readdir(path, function (err, files) {
                if (!files) {
                    log.error(err);
                    reject(err);
                } else {
                    files.forEach(function (file) {
                        if (!chunk) {
                            chunk = '';
                        }
                        var name = file.split('.')[0];
                        var uri = chunk + '/' + name;
                        if (file.indexOf('.js') > -1) {
                            require('./routes' + uri)(router);
                        }
                        else {
                            dirtree(pathbuiledr.join(path, file), uri);
                        }
                    });
                }
                resolve({});
            });

        }
        dirtree(path);
    });
}
var promises = {
    routes: routePromise(app, pathbuiledr.join(__dirname, 'routes')),
    db: mongoConnectPromise(conf.mongoConnect)
};

module.exports =  function(callback) {

    vow.all(promises).then(function (result) {
        app.set('port',conf.port);
        var dbfy = new dbfactory(result.db);
        app.set('dbmethods', dbfy);
        auth(passport, app);
        app.use(function(req, res, next) {
            if (toobusy()) {
                res.send(503, "Перегрузка!!");
            } else {
                next();
            }
        });
        app.use(function (req, res) {
            res.status(404).end('error');
        });
        app.use(function(req,res,next){
            var browser = req.headers['user-agent'];
            console.log(browser);
            if (browser.indexOf('Chrome')>-1 || browser.indexOf('Safari')>-1 || browser.indexOf('Opera')>-1 || browser.toLowerCase().indexOf('firefox') >-1)
            {
                next();
            }
            else
                res.status(503).send('эта версия браузера не поддерживается,обратитесь к системноу администатору для установки google chrome  <a href="https://www.google.ru/intl/ru/chrome/browser/index.html">https://www.google.ru/intl/ru/chrome/browser/index.html</a>, так же поддерживаются последние версии Opera, Yandex Browser, Safari, FireFox');
        });
        app.use(function(err, req, res, next) {
            if(err.message){
                log.error(err.message);
            }
            else
            {
                log.error(err);
            }
            res.status(500).send("Ooops!!");
        });

        callback(app);
    })
}

