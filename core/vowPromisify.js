var vow = require('vow');
var vowNode = require('vow-node');
var mongodb = require('mongodb');
function vowPromisify(db, collection) {
    this._db = db;
    this._collection = collection;
}
vowPromisify.prototype.aggregate = function (query) {
    var fn = vowNode.promisify(mongodb.Collection.prototype.aggregate);
    return fn.apply(this._db.collection(this._collection), query);
};
vowPromisify.prototype.findToArray = function (query,opts) {
    var fn = vowNode.promisify(mongodb.Cursor.prototype.toArray);
    var options = {};
    if(opts)
        options = opts;
    return fn.apply(this._db.collection(this._collection).find(query,options));
};
module.exports = vowPromisify;