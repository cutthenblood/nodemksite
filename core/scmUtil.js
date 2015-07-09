var _ = require('lodash');
function Util(db, collection) {

}
Util.prototype.dbScm = function (scm,result) {
    var _this = this;
    if(scm)
        scm.map(function(elem){
            if(['subgraphs','info'].indexOf(elem.type)<0){
                result.push(elem.name);
            } else if(elem.type == 'subgraphs')
                _this.dbScm(elem.sub,result);
        });
    return result;
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
}

module.exports = Util;