module.exports = function (app) {

    app.get('/phonelist', function (req, res) {
        res.render('phonelist/phonelist', { });
    });
}
