var url = require('url');
module.exports = function (app) {
    app.get('/deathmonitor', function (req, res) {
        var browser = req.headers['user-agent'];
        if (browser.indexOf('Chrome')>-1 || browser.indexOf('Safari')|| browser.indexOf('Opera')>-1 || browser.toLowerCase().indexOf('firefox'))
        {
            var url_parts = url.parse(req.url, true);
            var query = url_parts.query;
            var err =[];
            if(query.autherr) {
                err.push(query.autherr);
            }
            res.render('deathmonitor/login', { message: err });
        }
        else
        {
            res.status(503).send("эта версия браузера не поддерживается, можете скачать google chrome  https://www.google.ru/intl/ru/chrome/browser/index.html");
        }


    });
}
