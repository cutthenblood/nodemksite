var winston = require('winston');

module.exports = function(module){
    return new customlog(module.filename);
};
function customlog(modulename){
    var transport = [new winston.transports.Console({
        name: 'console#info',
        timestamp: true,
        colorize: true,
        level: 'info'

    }),
        new winston.transports.Console({
            name: 'console#error',
            timestamp: true,
            colorize: true,
            level: 'error'

        }),
        new winston.transports.File({name: 'file#debug',filename:'debug.log',level:'debug'}),
        new winston.transports.File({name: 'file#error',filename:'error.log',level:'error'}),
    ];
    var log = new winston.Logger({transports:transport});
    this.info = function(msg){
        return log.info("["+modulename+"] "+msg);
    },
    this.debug = function(msg){
        return log.debug("["+modulename+"] "+msg);
    },
    this.error = function(msg){
        return log.error("["+modulename+"] "+msg);
    },
    this.log = function(msg){
        return log.log("["+modulename+"] "+msg);
    }
}


