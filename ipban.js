// list of banned IPs
var ipaddr = require('ipaddr.js');
var util = require('util');
var whitelist = [
    ipaddr.parse('127.0.0.1'),
    ipaddr.parse('10.46.1.0') 
];




// middleware enabled or not
var enabled = true;

// the middleware function
module.exports = function(onoff) {
    
    enabled = (onoff == 'on') ? true : false;
    
    return function(req, res, next) {
        console.log(req.url);
        var addr = ipaddr.parse(req.connection.remoteAddress);
        var ok = false;
        if (enabled && req.url.indexOf('phonelist') > -1 ) {
            for (item in whitelist){
                if (addr.match(whitelist[item],24))
                {
                   return next();
                }
            }
            if (!ok)
            {
                  res.end('Banned');
            }
        
          
        }
        else { next(); }
    }
    
};