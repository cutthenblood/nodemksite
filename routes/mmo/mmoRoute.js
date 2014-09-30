var url = require('url');
module.exports = function (app) {
    app.get('/mmo', function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        res.render('mmo/mmoIndex', {});
    });
}
