var express = require('express');
var pathbuiledr = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var log = require('./log.js')(module);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var vow = require('vow');
var requireDir = require('require-dir');
var router = express.Router();
var mongodb = require('mongodb');
var dbfactory = require('./db');
var cons = require('consolidate');
var auth = require('./passport.js');
var passport = require('passport');
var session = require('express-session');
//var routes = require('./routes/phonelist/phonelist');
//var phonelist = require('./routes/phonelist/getUserPhoneList');
//var bcrypt   = require('bcrypt-nodejs');
//var pass = bcrypt.hashSync("Erkd#923", bcrypt.genSaltSync(10), null);
//var dir = requireDir('./views', {recurse: true});


//console.log(bcrypt.hashSync('admin_8921', bcrypt.genSaltSync(10), null)+'');

var ipban = require('./ipban.js');
var app = express();
app.use(session({ secret: 'jl;laskjf09239!@)&$(@#kj)@#H234m2jhljf)',cookie: { maxAge: 60000 }}));

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
app.use(passport.initialize());
app.use(passport.session());
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render();
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error(err.message);
    res.render('error', {
        message: err.message,
        error: {}
    });
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
    db: mongoConnectPromise('mongodb://127.0.0.1:27017/deathmonitor')
};
vow.all(promises).then(function (result) {
    app.set('port', process.env.PORT || 3000);
    var dbfy = new dbfactory(result.db)
    app.set('dbmethods',dbfy);
    auth(passport,app);
    var server = app.listen(app.get('port'), function () {
        log.info('Express server listening on port ' + server.address().port);
    });


});

