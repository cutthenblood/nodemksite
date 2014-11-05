var url = require('url');

function routeUtils () {};

routeUtils.prototype.loginErrors = function(requrl){
        var url_parts = url.parse(requrl, true);
        var query = url_parts.query;
        var err =[];
        if(query.autherr)
            err.push(query.autherr);
        return err;


    };






module.exports = routeUtils;

