var mongodb = require('mongodb');
var vowPromisify = require('./../vowPromisify.js');
var moment = require('moment');

module.exports  = function(db){
    this._db = db;
    this.getUser = function (userid){
        var vn = new vowPromisify(this._db, 'users');
        return vn.findToArray({"_id": new mongodb.ObjectID(userid)});
    };
    this.getUsers = function (enabled){
        var vn = new vowPromisify(this._db, 'users');
        var query = {"roles":"manager"};
        if(enabled)
            query.enabled =1;
        return vn.findToArray(query);
    };
    this.getSettings = function(){
        var vn = new vowPromisify(this._db, 'settings');
        return vn.findToArray({});
    };
    this.getPastEvents = function(){
        var vn = new vowPromisify(this._db, 'pastEvents');
        return vn.aggregate([
            {$match: {"creationDate": {$lte: this._endhorizon},"creationDate": {$gte: this._starthorizon}}},
            {$group:{
                "_id":"$managerId",
                "meets":{$sum: { $cond:  [{$and:[{$eq: ["$type", "meetingDone"]},{$ne: ["$result", "refuse"]}]},1,0]}},
                "empty_meetings":{$sum: { $cond:  [{$and:[{$eq: ["$type", "meetingDone"]},{$eq: ["$result", "newMeeting"]}]},1,0]}},
                "allmeets":{$sum: { $cond: [{$eq: ["$type", "meetingDone"]},1,0] }},
                "assign_meetings":{$sum: { $cond: [{$eq: ["$type", "meetingAssigned"]},1,0] }},
                "contract":{$sum: { $cond: [{$eq: ["$result", "contract"]},1,0] }},
                "recall":{$sum: { $cond: [{$eq: ["$type", "recall"]},1,0] }},
                "lost_clients":{$sum: { $cond: [{$and:[{$eq: ["$type", "lostClient"]},{$eq: ["$firstInClaim", true]}]},1,0] }},
                "reasign_lost_clients":{$sum: { $cond: [{$and:[{$eq: ["$type", "lostClient"]},{$eq: ["$firstInClaim", false]}]},1,0] }},
                "calls":{$sum: { $cond: [{$and:[{$eq: ["$type", "newClient"]},{$eq: ["$firstInClaim", true]}]},1,0] }},
                "reasign_calls":{$sum: { $cond: [{$and:[{$eq: ["$type", "newClient"]},{$eq: ["$firstInClaim", false]}]},1,0] }}
            }}]);
    };
    this.getRefused = function (clientid,refuseOnly){
        var vn = new vowPromisify(this._db, 'pastEvents');
        var arr = ["refuseClient"];
        if (!refuseOnly)
            arr.push("lostClient");
        var query = {$match:{
            $or:[
                {"type":{$in:arr}},
                {"result":"refuse"}]
        }};
        if(clientid)
            query["$match"].clientId = new mongodb.ObjectID(clientid);
        return vn.aggregate([query]);
    };
    this.getTodayCalls = function(reassigned){
        var vn = new vowPromisify(this._db, 'pastEvents');
        var dt = new Date();
        var startDay = moment(dt.valueOf()).startOf('day');
        return vn.aggregate([
            {$match:{"type":"newClient","firstInClaim":!reassigned,"creationDate":{$gte:startDay.valueOf()}}},
            {$group:{
                "_id":"$managerId",
                "cnt":{$sum:1}
            }}
        ]);
    };
    this.getTodayLPClients = function(){
        var vn = new vowPromisify(this._db, 'clients');
        var dt = new Date();
        var startDay = moment(dt.valueOf()).startOf('day');
        return vn.aggregate([
            {$unwind:"$claims"},
            {$match:{"claims.creation_date":{$gte:startDay.valueOf()},
                "claims.status":"new",
                "common_data.ad_manager":{$exists:true}}},
            {$unwind:"$claims.manager"},
            {$match:{"claims.manager.active":true}},
            {$project:{
                "mgrid":"$claims.manager._id",
                "adid":"$common_data.ad_manager",
                "ads":"$common_data.ad_source"
            }}
            ,{$match:{"adid":{$ne:"system"}}}
        ]);
    };
    //проверить что выставляется при лично привлеченном клиенте
    this.getLPClients = function(){
        var vn = new vowPromisify(this._db, 'clients');
        var dt = new Date();
        var startDay = moment(dt.valueOf()).startOf('day');
        return vn.aggregate([
            {$unwind:"$claims"},
            {$match:{"claims.creation_date": {$lte: this._endhorizon, $gte: this._starthorizon},
            "common_data.ad_manager":{$exists:true}}},

            {$project:{
                "cid":"$_id",
                "mid":"$common_data.ad_manager",
                "managers":"$claims.manager",
                "ads":"$common_data.ad_source"
            }}
            ,{$match:{"mid":{$ne:"system"}}}
        ]);
    };
    this.getActiveClients = function(){
        var vn = new vowPromisify(this._db, 'clients');
        return vn.findToArray({"active":true,"exists":true});
    };
    //---------------reports----------------------------------------------------------------------//
    this.getAdByDates = function () {
        var vn = new vowPromisify(this._db, 'clients');
        return vn.aggregate([{$match: {"creationDate": {$lte: this._endhorizon, $gte: this._starthorizon}}},
                {$project: {
                    "ad_source": "$common_data.ad_source",
                    "creationDate": "$creationDate"
                }}]
        );
    };
    this.getAdManagerByDates = function () {
        var vn = new vowPromisify(this._db, 'clients');
        return vn.aggregate([{$match: {"creationDate": {$lte: this._endhorizon, $gte: this._starthorizon}}},
                {$unwind:"$claims"},
                {$group:{
                    "_id":{"cd":"$common_data","cid":"$_id"},
                    "claim":{$first:"$claims"}
                }},
                {$unwind:"$claim.manager"},
                {$group:{
                    "_id":{"cd":"$_id.cd","cid":"$_id.cid"},
                    "manager":{$first:"$claim.manager"}
                }},
                {$project: {
                    "ad_source": "$_id.cd.ad_source",
                    "managers":"$manager._id"

                }},
                {$group:{
                    "_id":{"ad_source": "$ad_source",
                        "manager":"$managers"},
                    "cnt":{$sum:1}

                }} ]
        );
    };
    this.getDelayedClients = function () {
        var vn = new vowPromisify(this._db, 'clients');
        return vn.findToArray(
                {"claims.delayReassingDate":{$exists:true},"active":true},
                {"common_data.number":1,"common_data.name":1,"claims.manager":1}
        );
    };

    this.getAds = function () {
        var vn = new vowPromisify(this._db, 'adsources');
        return vn.findToArray({});
    };
    this.getAdsLp = function () {
        var vn = new vowPromisify(this._db, 'adsources');
        return vn.findToArray({"lichnoe":1});
    };
    this.getIncomingCalls = function () {
        var vn = new vowPromisify(this._db, 'clients');
        return vn.aggregate([{$match: {"creationDate": {$lte: this._endhorizon}}},
            {$unwind: "$claims"},
            {$match: {"claims.creation_date": {$lte: this._endhorizon}, "claims.creation_date": {$gte: this._starthorizon}}}]);
    };
    this.getSales = function () {
        var vn = new vowPromisify(this._db, 'clients');
        return vn.aggregate([
            {$match: {"creationDate": {$lte: this._endhorizon}, "exists": true}},
            {$unwind: "$claims"},
            {$match: {"claims.creation_date": {$lte: this._endhorizon}}},
            {$unwind: "$claims.manager"},
            {$match: { "claims.manager.assign_date": {$lte: this._endhorizon},
                "claims.manager.update_date": {$gte: this._starthorizon},
                "claims.manager.meetings.result": {$in: ["contract", "payment"]}}},
            {$project: {
                "documents": "$claims.manager.documents",
                "managerid": "$claims.manager._id",
                "ad_source": "$common_data.ad_source",
                "client": "$common_data.name"
            }}]);
    };
    this.getHouses = function (houses_id, houses_id_title) {
        var vn = new vowPromisify(this._db, 'houses');
        return vn.findToArray({_id: houses_id},
            {"full_address": 1, "organization": 1, "liter": 1, "apartments": {"$elemMatch": {"id_title": houses_id_title}}});
    };
};
