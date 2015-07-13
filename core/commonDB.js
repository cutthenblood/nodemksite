var mongodb = require('mongodb');
var vowPromisify = require('./vowPromisify.js');
var moment = require('moment');

module.exports  = function(db){
    this._db = db;

    this.getUsers = function (division){
        var vn = new vowPromisify(this._db, 'users');
        var query = {'username':{$ne:'Администратор'}};
        if(division)
            query.division = division;
        return vn.findToArray(query,{'password':0});
    };
    this.getSettings = function (){
        var vn = new vowPromisify(this._db, 'settings');
        return vn.findToArray({});
    };

    this.getOrgmWhoInput = function(data) {
        var _this = this;
        var req = {$match:{
            "inputdate":{$gte:data.startdate,$lte:data.stopdate}}
        };
        if(data.mo)
            req['$match']['rows.mo']=data.mo;
        if(data.username)
            req['$match']['rows.username']=data.username;

        var vn = new vowPromisify(this._db, data.collection);
        return vn.aggregate([{$unwind:"$rows"},req,{$project:{"username":"$rows.username","mo":"$rows.mo","date":"$inputdate"}}]);
    };
    this.getKadryWhoInput = function(data) {
        var _this = this;
        var req = {$match: {
            "kvartal": {$gte: data.kstart, $lte: data.kend},
            "year": {$gte: data.ystart, $lte: data.yend}
        }};

        var vn = new vowPromisify(this._db, 'kadry');
        return vn.aggregate([{$unwind:"$rows"},req,{$project:{"username":"$rows.username","mo":"$rows.mo","kvartal":"$kvartal","year":"$year"}}]);
    };

    this.getKadryReport = function(data) {
        var _this = this;
        var req = [{$unwind:"$rows"},{
            $match:{
                "kvartal":{$gte:data.kstart,$lte:data.kstop},
                "year":{$gte:data.ystart,$lte:data.ystop},
                "rows.username":{$in:data.mos}
            }}
        ];
        var vn = new vowPromisify(this._db, 'kadry');
        return vn.aggregate(req);

    }

};
