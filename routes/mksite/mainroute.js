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
var commonDB = require('./../../core/commonDB.js');
var pg = require('./../../core/pgDB.js');
var pako = require('pako');
var mt = require('moment-timezone');

var salt = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
function isAdminIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user.role=='admin')
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = function (app) {

    app.post('/auth', passport.authenticate('local'), function (req, res) {
        if(req.user){
            var user = _.clone(req.user, true);
            user.role = req.user.role;
            user.password = 'guess!!';
            res.send(req.isAuthenticated() ? user : '0');}
        else
            res.send('0');

    });
    app.post('/authenticate', passport.authenticate('local_pg'), function (req, res) {
        if(req.user){
            var user = _.clone(req.user, true);
            user.role = req.user.role;
            delete user.password;
            user.password = 'guess!!';
            if('pwd' in user)
                delete user.pwd;
            var query = new pg(app.get('pgdb'));
            query.loginstat({userid:user._id,type:'login',date:moment().utc().format(),ip:req.ip,ips:req.ips,useragent:req.headers['user-agent']})
                .then(function(e){},function(err){console.log(err)});
            res.send(req.isAuthenticated() ? user : '0');}
        else
            res.send('0');

    });
    app.get('/rest/:collection',function(req,res){
        var dbmethods = app.get('dbmethods');
        var cdb = new commonDB(app.get('db'));
        if(req.params.collection=='users')
            dbmethods.getUsers('users',function(er,result){
                if (er)
                {
                    log.info(er);
                    res.status(500).send("Ошибка");
                    return;
                } else {
                    res.send(JSON.stringify(result.sort(
                        function (a, b) {
                            if (a.username < b.username)
                                return -1;
                            else if (a.username == b.username) return 0;
                            else return 1;
                        }
                    ))).end();
                }
            });
        if(req.params.collection =='settings'){
            var promises = [cdb.getSettings()];
            vow.allResolved(promises).spread(function spread(settings){
                if (settings.isRejected()) {
                    log.error("rejected - "
                        + settings.isRejected() ? settings.valueOf() : "");
                    return callback("error in db query", null);
                } else {
                    var settingsValue = settings.valueOf();
                    res.send(JSON.stringify(settingsValue)).end();

                }
            })
        }
    });
    app.post('/reguser',function(req,res){
        var dbmethods = app.get('dbmethods');
        var otdel = req.body.otdel;
        var username = req.body.username;
        var password = req.body.password;
        var dbmethods = app.get('dbmethods');
        dbmethods.hasPassword(username,function (err, results) {
            if(err){
                log.error(err);
                res.status(500).send();
            } else {
                if(results.password || otdel!='kadry')
                    res.status(500).send('Пользователь существует');
                else {
                    var user =  {_id:results._id,password:salt(password)};
                    dbmethods.addPassword(user,function(err1,result){
                        if(err1)
                            res.status(500).send();
                        else
                            res.status(200).send();
                    })
                }
            }
        });



    });
    app.post('/validateDate',isLoggedIn, function (req, response) {
        var errmsg={res:"0",msg:"Ошибка"};
        var check = moment(parseInt(req.body.date));
        if(check.hour()!=0) {
            errmsg.msg = "Ошибка в часовом поясе!";
            response.send(JSON.stringify(errmsg));
            return;
        }
        var calend = {
            "2015":{
                "1":{"1":{"isWorking":2},"2":{"isWorking":2},"5":{"isWorking":2},"6":{"isWorking":2},"7":{"isWorking":2},"8":{"isWorking":2},"9":{"isWorking":2}},
                "2":{"23":{"isWorking":2}},
                "3":{"9":{"isWorking":2}},
                "5":{"1":{"isWorking":2},"4":{"isWorking":2},"11":{"isWorking":2}},
                "6":{"12":{"isWorking":2}},
                "11":{"4":{"isWorking":2}}
            }};


        var date = parseInt(req.body.date);
        var md = moment(date);
        var mo = req.body.mo;
        var type = req.body.type;
        var dow = md.day();
        var mn = md.month();
        var now = moment();
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
        dbmethods.getSettings('orgm',type,function(err,result){

            data.callback= function (err1,result1){
                if (err1)
                {
                    console.log(err);
                    res.status(500).send("Ошибка");

                }
                if(result1.length==0)
                    result1=[{}];

                if(!("rows" in result1[0]))
                    if(result.validateDate){
                        if(type == 'mpr'){
                           if(now.valueOf()<date){
                                errmsg.res="0";
                                errmsg.msg= "Воод только за прошедшие дни или сегодня";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }
                            else if(now.hour()>11){
                                errmsg.msg= "Нужно вводить данные до 12";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }else if(now.day()==1 && dow >4){
                                errmsg.res="1";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }

                            /*else if(  [0,1].indexOf(now.day()-dow)>=0 && now>=md){
                             errmsg.res="1";
                             response.send(JSON.stringify(errmsg));
                             return;
                             } */
                            else {
                                errmsg.res= "1";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }

                        }
                        else if(type == 'deathm') {
                            if(now.hour()>15){//todo was 9
                                errmsg.msg = "Нужно вводить данные до 10";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }else if(now.day()==1 && dow >4){
                                errmsg.res="1";
                                response.send(JSON.stringify(errmsg));
                                return;
                            } else if((now.day()-dow)==1 && now>=md){
                                errmsg.res="1";
                                response.send(JSON.stringify(errmsg));
                                return;
                            } else {
                                errmsg.msg = "Нужно вводить ежедневно за прошедший день";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }
                        }
                        else if (type =='mprPD'){
                            if(now.hour()>11){
                                errmsg.msg = "Нужно вводить данные до 12";
                                response.send(JSON.stringify(errmsg));
                                return;
                            } else  if(now.date()>29 || now.date()<24){
                                errmsg.msg = "Нужно вводить данные с 24 по 29 число месяца";
                                response.send(JSON.stringify(errmsg));
                                return;
                            } else {
                                errmsg.res="1";
                                response.send(JSON.stringify(errmsg));
                                return;
                            }
                        }
                    }
                    else {
                        errmsg.res="1";
                        response.send(JSON.stringify(errmsg));
                        return;
                    }
                else{
                    errmsg.res="0";
                    errmsg.msg="данные уже внесены";
                    response.send(JSON.stringify(errmsg));}
            };
            dbmethods.checkDate(data);
        });
    });
    app.post('/whoinput',isLoggedIn, function (req, response) {

        var start =parseInt(req.body.start);
        var end = parseInt(req.body.end);
        var kstart = parseInt(req.body.kstart);
        var kend = parseInt(req.body.kend);
        var ystart = parseInt(req.body.ystart);
        var yend = parseInt(req.body.yend);
        var type = req.body.type;
        var user = req.body.username;
        var mo = req.body.mo;
        var all = req.body.all;
        var dbmethods = app.get('dbmethods');
        var cdb = new commonDB(app.get('db'));
        var collection = '';

        var data = {startdate:start,stopdate:end};
        /*if (type=='kadry'){
            var promises = [cdb.getUsers('kadry'), cdb.getKadryWhoInput(req.body)];
            vow.allResolved(promises).spread(function spread(users, kadrywhoinput) {
                if (kadrywhoinput.isRejected()) {
                    log.error("rejected - "
                        + kadrywhoinput.isRejected() ? kadrywhoinput.valueOf() : "");
                    return callback("error in db query", null);
                }
                else if (users.isRejected()) {
                    log.error("rejected - "
                        + users.isRejected() ? users.valueOf() : "");
                    return callback("error in db query", null);
                } else {
                    var whoinputValue = kadrywhoinput.valueOf();
                    var usersValue = users.valueOf();
                    var gbd = _.groupBy(whoinputValue,function(item){
                        var tmp = item.year.toString()+item.kvartal.toString();
                        return tmp
                    });
                    var kstart = req.body.kstart;
                    var kend = req.body.kend;
                    var ystart = req.body.ystart;
                    var yend = req.body.yend;
                    var res = [];
                    for(var i = ystart;i<yend+1;i++)
                        for(var j = kstart;i<kend+1;i++){
                            var ind = i.toString()+ j.toString();
                            if(ind in gbd){

                            }


                        }





                }
            });
        }*/
        if(type == 'mpr'){
            data.division = 'orgm';
            data.collection = 'orgmMpr';
            data.mo = mo;}
        else if(type == 'mprPD'){
            data.division = 'orgm';
            data.collection = 'orgmMprPD';
            data.mo = mo;
        }
        else if(type == 'deathm'){
            data.division = 'orgm';
            data.collection = 'everyday';
            data.username = user;
        }
        else if(type == 'kadry'){
            data.division = 'kadry';
            data.collection = 'kadry';
            data.username = user;
        }
        if(all=="true") {
            data.username = undefined;
            data.mo = undefined;
        }
       /* callback = function(err,result){
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
                    curdate = moment(curdate).add(24, 'h').valueOf();;
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
        }*/
        var promises = [cdb.getUsers(data.division)];
        if(type=='kadry')
            promises.push(cdb.getKadryWhoInput(req.body));
        else
            promises.push(cdb.getOrgmWhoInput(data));
        vow.allResolved(promises).spread(function spread(users, whoinput){
            if (whoinput.isRejected()) {
                log.error("rejected - "
                    + whoinput.isRejected() ? whoinput.valueOf() : "");
                return callback("error in db query", null);
            }
            else if (users.isRejected()) {
                log.error("rejected - "
                    + users.isRejected() ? users.valueOf() : "");
                return callback("error in db query", null);
            }else {
                var whoinputValue = whoinput.valueOf();
                var usersValue = users.valueOf();
                try {
                    if (all == "false")
                        usersValue = usersValue.filter(function (usr) {
                            if ((type == 'deathm' || type == 'kadry') && usr.username == user)
                                return usr;
                            if (type == 'mpr' || type == 'mprPD') {
                                if (type == 'mprPD' && usr.uz == mo)
                                    return usr;
                                else {
                                    if ('mo' in usr) {
                                        var flt = usr.mo.filter(function (t) {
                                            if (t.fullname == mo)
                                                return t;
                                        });
                                        if (flt.length > 0)
                                            return usr;
                                    }
                                }
                            }
                        });
                }
                catch(e){
                    console.log(e);
                }
                var dateformat = (type == 'mprPD')?'MM/YYYY':'DD.MM.YYYY';

                var gbd = _.groupBy(whoinputValue,function(item){
                    if(type=="kadry")
                        return [item.kvartal,item.year];
                    else
                        return moment(item.date).format(dateformat);
                });
                var dtbl = {};
                if(['mpr','mprPD','deathm'].indexOf(type)>=0){
                    var cur = moment(start);
                    while (cur.valueOf()!=moment(end).add((type == 'mprPD')?'months':'days',1).valueOf()) {
                        dtbl[cur.format(dateformat)] = [];
                        cur = cur.add((type == 'mprPD')?'months':'days',1);
                    }
                } else if(type=='kadry'){
                    for(var i = ystart;i<yend+1;i++)
                        for(var j = kstart;j<kend+1;j++)
                            dtbl[[j,i]]=[];
                }

                var res = [];
                var startm = moment(parseInt(start));
                try {
                    usersValue.map(function (user) {
                        if (type == 'mpr' || type == 'mprPD') {
                            if ('uz' in user && type == 'mprPD') {
                                var cur = moment(start);
                                while (cur.valueOf() != moment(end).add((type == 'mprPD')?'months':'days',1).valueOf()) {
                                    var curorgs = gbd[cur.format(dateformat)];
                                    if (curorgs) {
                                        var rs = curorgs.filter(function (curorg) {
                                            if (curorg.uz == user.uz)
                                                return curorg;
                                        });
                                        if (rs.length == 1) {
                                            cur = cur.add((type == 'mprPD') ? 'months' : 'days', 1);
                                            continue;
                                        }
                                    }
                                    dtbl[cur.format(dateformat)].push({mo: user.uz});
                                    cur = cur.add((type == 'mprPD') ? 'months' : 'days', 1);
                                }
                            } else if ('mo' in user)
                                user.mo.map(function (moname) {

                                    var cur = moment(start);
                                    while (cur.valueOf() != moment(end).add((type == 'mprPD')?'months':'days',1).valueOf()) {
                                        var curorgs = gbd[cur.format(dateformat)];
                                        if (curorgs) {
                                            var rs = curorgs.filter(function (curorg) {
                                                if (curorg.mo == moname.fullname)
                                                    return curorg;
                                            });
                                            if (rs.length == 1) {
                                                cur = cur.add((type == 'mprPD') ? 'months' : 'days', 1);
                                                continue;
                                            }
                                        }
                                        dtbl[cur.format(dateformat)].push({mo: moname.fullname});
                                        cur = cur.add((type == 'mprPD') ? 'months' : 'days', 1);
                                    }
                                })
                        }
                        else if (type == 'deathm') {
                            var cur = moment(start);

                            while (cur.valueOf() != moment(end).add('days',1).valueOf()) {
                                var curorgs = gbd[cur.format(dateformat)];
                                if (curorgs) {
                                    var rs = curorgs.filter(function (curorg) {
                                        if (curorg.username == user.username)
                                            return curorg;
                                    });
                                    if (rs.length == 1) {
                                        cur = cur.add('days', 1);
                                        continue;
                                    }
                                }
                                dtbl[cur.format(dateformat)].push({mo: user.username});
                                cur = cur.add('days', 1);
                            }
                        }
                        else if (type == 'kadry') {
                            for(var i = ystart;i<yend+1;i++)
                                for(var j = kstart;j<kend+1;j++){
                                    var curorgs = gbd[[j,i]];
                                    if(curorgs){
                                        var rs = curorgs.filter(function (curorg) {
                                            if (curorg.username == user.username)
                                                return curorg;
                                        });
                                        if (rs.length == 1) continue;
                                    }
                                    dtbl[[j,i]].push({mo: user.username});
                                }
                        }

                    });
                }
                catch(e){
                    console.log(e);
                }
                response.send(JSON.stringify(dtbl
                  /*  res.sort(function(a,b){
                    return moment(a.date,dateformat).diff(moment(b.date,dateformat));
                })*/
                )).end();


            }
        });

        //dbmethods.getOrgmWhoInput(data);

    });
    app.delete('/logout', function(req, res){
            req.logout();
             res.status(200).send('logout');

        });
    /*app.get('/logout', function(req, res){
        req.logout();
        res.status(200).send('logout');

    });*/
    app.post('/kadry/report/',isAdminIn,function(req,resp){
        console.log('report route');
        var reqdata = JSON.parse(pako.inflate(req.body.cp.split(','),{to:"string"}));
        var cdb = new commonDB(app.get('db'));
        var data = {
                    kstart:reqdata.kstart,
                    kstop:reqdata.kend,
                    ystart:reqdata.ystart,
                    ystop:reqdata.yend,
                    mos:reqdata.mos
        };


        var promises = [cdb.getKadryReport(data)];
        vow.allResolved(promises).spread(function spread(repdata){
            if (repdata.isRejected()) {
                log.error("rejected - "
                    + repdata.isRejected() ? repdata.valueOf() : "");
                return callback("error in db query", null);
            }
            else{
                var repdataValue = repdata.valueOf();

                var sumall = {};
                repdataValue.map(function(itm){
                    _.forEach(itm.rows,function(val,key){
                        if(val==null)

                        if(key[0]=='r')
                            if(key in sumall)
                                sumall[key]+=val;
                            else
                                sumall[key]=val;
                    })

                });
                var grp = _.groupBy(repdataValue,function(itm){
                     return itm.rows.username;
                });
                var rdu = _.reduce(grp,function(result, n,key){
                    result = (result.length==0)? key:result+', '+key;
                    return result;

                },"");


                 fs.readFile(path.join(__dirname, '../../templates/kadry/kadry.xlsx'), function (err, xlsx) {
                        var template = new XlsxTemplate(xlsx);
                        var sheetNumber = 1;
                        var values = {
                            date: "Квартал с "+reqdata.kstart+' по '+reqdata.kend+' год c '+reqdata.ystart+" по "+reqdata.yend,
                            mos:rdu,
                            grs: [sumall]//.sort(sortrows)
                        };
                        try {
                            template.substitute(sheetNumber, values);
                        }
                        catch (e) {
                            log.error(e);
                        }
                        var doc = template.generate();
                        resp.setHeader('Content-Type', 'application/vnd.openxmlformats');
                        resp.setHeader("Content-Disposition", "attachment; filename=ReportKadry.xlsx");
                        resp.status(200).end(doc,'binary');

               });



       }

        });
        /*



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

        }*/
    });

    app.get('/mk', function (req, res) {
        var browser = req.headers['user-agent'];
        console.log(browser);
        if (browser.indexOf('Chrome') > 0 || browser.indexOf('CriOS') > 0)
            res.render('mksite', {appfolder:'pgapp/main'});
        else
            res.render('browser', {});

        //res.render('mksite', {});
    });
    app.post('/save',isLoggedIn, function(req, res,next) {

        var query = new pg(app.get('pgdb'));
        try {
            query.insup(req.body).then(function (e) {
                    e.promise.then(function(res){
                        console.log(res.command);
                    },
                        function (err) {
                            console.log(err);
                        })



                },
                function (err) {
                    console.log(err);
                });
        }
        catch(e){
            var b=12;
        }

//        var dbmethods = app.get('dbmethods');
//        var type = req.body.type;
//        delete req.body.type;
//        delete req.body.info;
//        delete req.body.table;
//        delete req.body.user;
//
//        if (req.body.hasOwnProperty('_id')) {
//            delete req.body._id;
//        }
//        req.body.inputdate = parseInt(req.body.inputdate);
//        var collection='';
//        if(type == 'mpr')
//            collection = 'orgmMpr';
//        if(type == 'mprPD')
//            collection = 'orgmMprPD';
//        if(type == 'deathm')
//            collection = 'everyday';
//        dbmethods.insupOrgm(collection,req.body,function (err, results) {
//            if (err) {
//                log.error(err);
//                res.status(500).send();
//            } else {
//                res.status(200).send();
//            }
//        });

    });
    app.post('/getinput',isLoggedIn, function (req, response) {

        var query = new pg(app.get('pgdb'));
        query.getByUser(req.body).then(function(e){
                var a=12;
                response.send(JSON.stringify(e.rows));

        },
        function(err){
            var b = 12;
        })




        /*var collection = '';

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


        dbmethods.getOrgmWhoInput(data);*/

    });
    app.post('/vDate',isLoggedIn, function (req, response) {
        var errmsg={res:"0",msg:"Ошибка"};
        var calend = {
            "2015":{
                "1":{"1":{"isWorking":2},"2":{"isWorking":2},"5":{"isWorking":2},"6":{"isWorking":2},"7":{"isWorking":2},"8":{"isWorking":2},"9":{"isWorking":2}},
                "2":{"23":{"isWorking":2}},
                "3":{"9":{"isWorking":2}},
                "5":{"1":{"isWorking":2},"4":{"isWorking":2},"11":{"isWorking":2}},
                "6":{"12":{"isWorking":2}},
                "11":{"4":{"isWorking":2}}
            }};



        var md = moment(req.body.date,'DD.MM.YYYY');
        var date = parseInt(md.valueOf());
        var mo = req.body.mo;
        var type = req.body.type;
        var dow = md.day();
        var mn = md.month();
        var now = moment();
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
        var query = new pg(app.get('pgdb'));
        query.vDate(req.body).then(function(e){
                if(e.rows.length>0){
                    if(e.rows[0].validatedate){
                        if(e.rows[0].indb){
                            errmsg.res="0";
                            errmsg.msg="данные уже внесены";
                            response.send(JSON.stringify(errmsg));
                        } else{
                            if(type == 'mlodn'){
                                if(now.valueOf()<date){
                                    errmsg.res="0";
                                    errmsg.msg= "Воод только за прошедшие дни или сегодня";
                                    response.send(JSON.stringify(errmsg));
                                    return;
                                }
                                else if(now.hour()>11){
                                    errmsg.msg= "Нужно вводить данные до 12";
                                    response.send(JSON.stringify(errmsg));
                                    return;
                                }else if(now.day()==1 && dow >4){
                                    errmsg.res="1";
                                    response.send(JSON.stringify(errmsg));
                                    return;
                                }
                                else {
                                    errmsg.res= "1";
                                    response.send(JSON.stringify(errmsg));
                                    return;
                                }

                            }
                        }

                    }
                    else {
                        errmsg.res="1";
                        response.send(JSON.stringify(errmsg));
                        return;
                    }
                }

        },
        function(err){
            console.log(err);
        });

    });
};