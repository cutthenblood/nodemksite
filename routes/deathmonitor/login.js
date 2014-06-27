var url = require('url');
module.exports = function (app) {
    app.get('/deathmonitor', function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var err =[];
        if(query.autherr) {
            err.push('Неправильный пароль');
        }
        res.render('deathmonitor/login', { message: err });
    });
}
