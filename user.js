var bcrypt   = require('bcrypt-nodejs');


var User = function(fields) {
    var _this = this;
    for (var key in fields) {
        this[key] = fields[key];
    }
    this.generatesalt = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    this.validPassword = function(password,callback) {
       bcrypt.compare(password, _this.password, function(err, res) {
           console.log(err);
            callback(res);

        });

    };
}

module.exports = User;