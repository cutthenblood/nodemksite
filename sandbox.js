var util = require('./core/scmUtil.js');
var scm = require('./public/pgapp/schemas/mloDnScm.js');

var scmutil = new util();
var res = scmutil.dbScm(scm,[]);

var ir = scmutil.update(res);
var a=12;
