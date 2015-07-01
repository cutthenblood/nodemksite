var vowNode = require('vow-node');
var moment = require('moment');
var pg = require('pg');
var promiseQuery = function(obj,config,values){
    var fn = vowNode.promisify(pg.Client.prototype.query);
    if(values)
        return fn.call(obj, config,values);
    else
        return fn.call(obj, config);
};
module.exports  = function(db){
    this._db = db;
    this.getUsers = function (division){
        return promiseQuery(this._db.db,'select users.username from users join divisions on users.division = divisions.id where divisions= $1',[division]);
    };
    this.done = function(){
        this._db.done();
    };
    this.getUserAuth = function (username, callback) {
        var _this = this;
        return promiseQuery(this._db.db,
            'select privileges.webfaceaccess, users.username, users.pwd ' +
                'from users ' +
                'join divisions on users.division = divisions.id ' +
                'join privileges on divisions.id = privileges.divisionid ' +
                'where users.username= $1',
            [username]);
    }


};