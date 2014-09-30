// Much better!
var log = require('../log.js')(module);
//var cluster = require('cluster');


/*
if (cluster.isMaster) {

    cluster.fork();
    cluster.fork();

    cluster.on('disconnect', function (worker) {
        log.error('disconnect!');
        cluster.fork();
    });

} else {
    var domain = require('domain');
    var serverfn = require('../app');
    serverfn(function (app) {
        app.use(function (req, res, next) {

            var d = domain.create();
            d.on('error', function (er) {
                log.error('error', er.stack);

                try {
                    // make sure we close down within 30 seconds
                    var killtimer = setTimeout(function () {
                        process.exit(1);
                    }, 30000);
                    // But don't keep the process open just for that!
                    killtimer.unref();

                    // stop taking new requests.
                    server.close();

                    cluster.worker.disconnect();

                    // try to send an error to the request that triggered the problem
                    res.statusCode = 500;
                    res.setHeader('content-type', 'text/plain');
                    res.end('Oops, there was a problem!\n');
                } catch (er2) {
                    // oh well, not much we can do at this point.
                    console.error('Error sending 500!', er2.stack);
                }
            });

            d.add(req);
            d.add(res);

            // Now run the handler function in the domain.
            d.run(function () {
                app.router(req, res, next);
            });
        });

        var server = app.listen(app.get('port'), function () {
            log.info('domain wrapper');
            log.info('Express server listening on port ' + app.get('port'));
        });
    });
}
*/



 var domain = require('domain');
 var serverdomain = domain.create();

 var log = require('../log.js')(module);
 serverdomain.on('error',function(err){
 log.error("domain: " +err);
 });

 serverdomain.run(function(){
var serverfn = require('../app');
serverfn(function(app){

 app.listen(app.get('port'), function() {
 log.info('domain wrapper');
 log.info('Express server listening on port ' + app.get('port'));
 });

});

//
 });





