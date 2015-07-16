var vowNode = require('vow-node');
var vow = require('vow');
var moment = require('moment');
var pg = require('pg');
var sutil = require('./scmUtil.js');
var mloDnScm = require('./../public/pgapp/schemas/mloDnScm.js');
var conf = require('./../config.js');






var promiseQuery = function(obj,text, values) {
    console.log(text);
    console.log(values);
    pg.defaults.poolSize = 200;
    return new vow.Promise(function (resolve, reject) {
        pg.connect(conf.pgConnect, function (err, client, done) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                try {
                    client.query(text, values, function (err, result) {
                        done();
                        if(err)
                            reject(err);
                        else
                            resolve(result);
                    });
                }
                catch (e) {
                    done();
                    reject(e);
                }
            }
        });
    });
}




//var promiseQuery = function(obj,config,values){
//    //console.log('promiseQuery - '+config);
//    //console.log('promiseQueryVals - '+values);
//    var fn = vowNode.promisify(pg.Client.prototype.query);
//    if(values)
//        return fn.call(obj, config,values);
//    else
//        return fn.call(obj, config);
//};
module.exports  = function(db){
    this._db = db;
    this.scmutil = new sutil();
    this.getUsers = function (division){
        return promiseQuery(this._db.db,'select users.username from users join divisions on users.division = divisions.id where divisions= $1',[division]);
    };
    this.done = function(){
      //  this._db.done();
    };
    this.getUserAuth = function (id,division) {
        var _this = this;
        return promiseQuery(this._db.db,
            'select users.id as _id, privileges.webfaceaccess, users.username, users.pwd, divisions.name as division, monitorings.monitorings,roles.role ' +
                'from users ' +
                'join divisions on users.division = divisions.id ' +
                'join roles on users.role = roles.id ' +
                'join privileges on divisions.id = privileges.divisionid and roles.id = privileges.role ' +
                'join monitorings on divisions.id = monitorings.division ' +
                'where users.id= $1 and divisions.name = $2',
            [id,division]);
    },
    this.getUsersByDivision = function(division){
        try {
            return promiseQuery(this._db.db,
                    'select users.id, users.username ' +
                    'from users ' +
                    'join divisions on users.division = divisions.id ' +
                    'where divisions.name = $1 ' +
                    'ORDER BY users.role Desc, users.username ASC ;',
                [division]);
        }
        catch(e){
            var a=123;
        }
    },
    this.getUserById = function (id) {
        return promiseQuery(this._db.db,
            'SELECT users.id,users.id as _id,users.username, roles.role,divisions.name as division,mos.name as mo,uzs.name as uz,privileges.webfaceaccess ' +
            'FROM users ' +
            'join roles on users.role = roles.id '+
            'join divisions on users.division = divisions.id '+
            'left join usermos on users.id = usermos.userid '+
            'left join mos on usermos.moid = mos.id '+
            'left join useruz on users.id = useruz.userid '+
            'join privileges on divisions.id = privileges.divisionid '+
            'left join uzs on useruz.uzid = uzs.id ' +
            'where users.id=$1;',[id]);
//        this._db.collection(collection).find({_id: new mongodb.ObjectID(id)}).toArray(function (err, result) {
//            errproc(err,result,function(){
//                if (result.length) {
//                    callback(null, result[0]);
//                } else {
//                    callback('user not exists',null);
//                }
//            });
//        });
    },
    this.checkIfInDb = function(data){

        /*select * from (select 'mlodn'::text as monitoring, userid, moid, inputdate from mlodn) as t
        left join permissons as t2  on t2.monitoring = t.monitoring*/
        //this._db.db.query

        var query = ["select * from (select id as _id, '",data.type, "'::text as monitoring, userid, moid, inputdate from "+data.type+
            ' where (userid = $1 and inputdate = $2 and mtype = $3 and rtype = $4',(data.moid)?'and moid = $5 ':'',')',
            ") as t"
            ," left join permissons as t2  on t2.monitoring = t.monitoring ",
            ];
        var vals = [data.userid,data.inputdate,data.mtype];
        if(data.rtype)
            vals.push(data.rtype);
        else
            vals.push(null);
        if(data.moid)
            vals.push(data.moid);
        //console.log(query.join(""));
       /* this._db.db.query(query.join(""),vals,function(err,res){
            var a=12;
        })*/
        return promiseQuery(this._db.db,query.join(""),vals);

    },
    this.getPermissions = function(data){
        return promiseQuery(this._db.db,'select * from permissions where monitoring = $1',[data.type]);
    },
    this.insup = function (data){
        var pdata = this.scmutil.convData(data);
        return this["insert"+pdata.type](pdata);
    };
    this.insertmlodn = function(data){
        var _this = this;
        return new vow.Promise(function(resolve,reject){
            _this.checkIfInDb(data).then(function(e){
                    var vals =[];
                    var fields = _this.scmutil.dbScm(mloDnScm,[]);
                    var promise;
                    if(e.rows.length>0){
                        var statement = _this.scmutil.update(fields);
                        var vals=[];
                        fields.map(function(itm){vals.push(data[itm])});
                        vals.push(parseInt(e.rows[0]._id));
                            promise = promiseQuery(_this._db.db,
                                ['UPDATE ', data.type, ' SET ', statement, ' WHERE id=$', fields.length + 1, ';'].join(""),
                                vals);
                    } else {
                        fields.push('userid');
                        vals=[];
                        var statement = _this.scmutil.insert(fields);
                        fields.map(function(itm){vals.push(data[itm])});
//                        console.log(['INSERT INTO '+data.type+' ( ',
//                            statement.fields,' ) ',
//                            'VALUES ( ',statement.values,' );'].join(""));
                        promise= promiseQuery(_this._db.db,
                            ['INSERT INTO '+data.type+' ( ',
                                statement.fields,' ) ',
                                'VALUES ( ',statement.values,' );'].join(""),
                            vals);
                    }
                    resolve({promise:promise});
                    /*promise.then(function(e){
                        resolve(e);

                    })*/


                },
                function(err){
                    reject(err);
                    var a=12;


                });
        })








    };
    this.getByUser = function(data){
        return promiseQuery(this._db.db,'select * from '+data.type+' where userid = $1 and (inputdate BETWEEN $2 and $3) order by inputdate desc',[data.userid,data.start,data.end]);
    };
    this.getSettings = function(data){
        return promiseQuery(this._db.db,'select settings.* from divisions left join settings on divisions.id=settings.division where divisions.name = $1 and settings.monitoring=$2',[data.division,data.type]);
    };
    this.vDate = function(data){



//        var stmt = 'select t.id as indb, settings.validatedate from users                                               '+
//            'left join '+data.type+' as t on t.userid = users.id and t.inputdate = $2 '+
//            'join divisions on users.division = divisions.id                                                     '+
//            'join settings on divisions.id = settings.division                                                   '+
//            'where users.id=$1  and settings.monitoring=$3;                                               ';
          var stmt = [
              'select t.id as indb, settings.validatedate from users ',
            'left join mlodn as t on t.userid = users.id and t.inputdate = $2 and t.mtype= $3',
              (data.rtype.length>1)?' and t.rtype = $4 ':' ',
            'join divisions on users.division = divisions.id ',
            'join settings on divisions.id = settings.division ',
            "where users.id=$1  and settings.monitoring='mlodn' ;"];
          var vals = [data.userid,data.inputdate,data.mtype];
        console.log(stmt.join(' '));
        if(data.rtype.length>1)
            vals.push(data.rtype);


        return promiseQuery(this._db.db,stmt.join(' '),vals);

    };
    this.loginstat = function(data){
        return promiseQuery(this._db.db,'INSERT INTO loginstat(userid, type, date, ip, ips, useragent) VALUES ( $1, $2, $3, $4, $5, $6);',[
            data.userid,data.type,data.date,data.ip,data.ips,data.useragent

        ])
    };
    this.report = function(data){
        return this["report"+data.type](data);
    };
    this.reportmlodn = function(data){
        var fields = {};
        this.scmutil.reportScm(mloDnScm,fields);
        var stmt =  this.scmutil.report(data,fields);
        //console.log(stmt);

        return promiseQuery(this._db.db,stmt,[data.start]);
    }




};