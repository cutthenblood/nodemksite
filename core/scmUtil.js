var _ = require('lodash');
function Util(db, collection) {

}
Util.prototype.dbScm = function (scm,result) {
    var _this = this;
    if(scm)
        scm.map(function(elem){
            if(['subgraphs','info','id'].indexOf(elem.type)<0){
                result.push(elem.name);
            } else if(elem.type == 'subgraphs')
                _this.dbScm(elem.sub,result);
        });
    return result;
};
Util.prototype.reportScm = function(scm,result){
    var _this = this;
    if(!('group' in result))
        result.group=[];
    if(!('sum' in result))
        result.sum=[];
//    if(!('total' in result))
//        result.total=[];
    if(scm)
        scm.map(function(elem){
            if(['subgraphs','info'].indexOf(elem.type)<0){
                if(elem.report)
                    result.sum.push(elem.name);
                if(elem.group)
                    result.group.push(elem.name)
//                if(elem.total)
//                    result.total.push(elem.name)

            } else if(elem.type == 'subgraphs')
                _this.reportScm(elem.sub,result);
        });


};
Util.prototype.insert = function (fields) {
    return {fields:fields.join(', '), values: _.range(fields.length+1).join(', $').slice(3)};

};
Util.prototype.update = function(fields){
    var i =0;
    return fields.reduce(function(prev,next){
        i++;
        return prev+next+'=$'+i+', ';
    },'').slice(0,-2);
};
Util.prototype.convData = function(data){
    var res = {userid:parseInt(data.user._id),inputdate:data.inputdate,type:data.type.toLowerCase()};
    _.map(data.rows[0],function(itm,key){
        res[key]=itm});
    return res;
};
Util.prototype.report = function(data,fields){
    var sum = fields.sum.reduce(function(prev,next){
        return prev+'sum('+next+') as '+next+', '
    },'').slice(0,-2);
    //var nnulls = Array(fields.group.length).join('null,');
    var stmt = 'SELECT DISTINCT ON (c.username, c.'+fields.group.join(', c.')+') '+
    'c.username, c.'+fields.group.join(', c.')+', c.'+fields.sum.join(', c.')+
    ' FROM (SELECT * FROM mlodn '+
    'join users on mlodn.userid = users.id '+
    'where  inputdate  <=$1 '+
    'ORDER BY inputdate DESC) c;';

//    var stmt = 'with w as ( '+
//    '    select username, '+fields.group.join(', c.')+', '+sum+
//    ' from '+data.type+
//    ' join users on '+data.type+'.userid = users.id '+
//    ' where userid in ('+data.mos.join(', ')+') '+
//    'and (inputdate  BETWEEN $1 and $2) group by  username, '+fields.group.join(', ')+' order by username ) '+
//    'select * from w '+
//    "union all select 'total', "+fields.group.join(', ')+', '+sum+
//    ' from w group by '+fields.group.join(', ')+';';
    console.log(stmt);
    return stmt;



//    return 'select username, '+fields.group.join(', ')+', '+sum+' from '+data.type
//        +' join users on mlodn.userid = users.id '+
//        ' where userid in ('+data.mos.join(', ')+') and (inputdate BETWEEN $1 and $2) '+
//        'group by username, '+fields.group.join(', ');

}

module.exports = Util;