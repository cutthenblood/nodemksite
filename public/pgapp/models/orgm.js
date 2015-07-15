// Filename: models/orgm
define([
    'backbone'
], function(Backbone){
    var Model = Backbone.Model.extend({
        url: '/save',
        setModel: function(name){
            this._model = name;
        },
        validate: function (attrs) {
            var errors = [];
            for (var property in attrs.rows[0]) {
                if (attrs.rows[0].hasOwnProperty(property)) {
                    if(property.indexOf('gr')>-1){
                        attrs.rows[0][property] = parseInt(attrs.rows[0][property]);
                    }
                }
            }
            if(this._model =='mpr') {
                if (attrs.rows[0].gr5 < attrs.rows[0].gr6) {
                    errors.push(['gr5', 'гр. 5 ≥ гр. 6']);
                }
                ;
                if (attrs.rows[0].gr6 < attrs.rows[0].gr8) {
                    errors.push(['gr8', 'гр. 6 ≥ гр. 8']);
                }
                ;
                if (attrs.rows[0].gr6 < attrs.rows[0].gr9) {
                    errors.push(['gr9', 'гр. 6 ≥ гр. 9']);
                }
                ;
                if (attrs.rows[0].gr6 < attrs.rows[0].gr10) {
                    errors.push(['gr10', '6 ≥ гр. 10']);
                }
                ;
                if (attrs.rows[0].gr6 < attrs.rows[0].gr11) {
                    errors.push(['gr11', 'гр. 6 ≥ гр. 11']);
                }
                ;
                if (attrs.rows[0].gr6 < attrs.rows[0].gr12) {
                    errors.push(['gr12', 'гр. 6 ≥ гр. 12']);
                }
                ;
                if (attrs.rows[0].gr6 < attrs.rows[0].gr13) {
                    errors.push(['gr13', 'гр. 6 ≥ гр. 13']);
                }
                ;
                if (attrs.rows[0].gr6 != (attrs.rows[0].gr10 + attrs.rows[0].gr11 + attrs.rows[0].gr12 + attrs.rows[0].gr13)) {
                    errors.push(['gr10', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                    errors.push(['gr11', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                    errors.push(['gr12', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                    errors.push(['gr13', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                }
                ;
                if (attrs.rows[0].gr6 != (attrs.rows[0].gr21 + attrs.rows[0].gr22 + attrs.rows[0].gr23 + attrs.rows[0].gr24)) {
                    errors.push(['gr21', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                    errors.push(['gr22', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                    errors.push(['gr23', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                    errors.push(['gr24', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                }
                ;
                if (attrs.rows[0].gr6 != (attrs.rows[0].gr14 + attrs.rows[0].gr15 + attrs.rows[0].gr16 + attrs.rows[0].gr17 + attrs.rows[0].gr18 + attrs.rows[0].gr19 + attrs.rows[0].gr20)) {
                    errors.push(['gr14', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr15', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr16', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr17', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr18', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr19', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr20', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                }
                ;
                if (attrs.rows[0].gr6 != (attrs.rows[0].gr25 + attrs.rows[0].gr26)) {
                    errors.push(['gr25', ' гр. 6 = гр. 25 + 26']);
                    errors.push(['gr26', ' гр. 6 = гр. 25 + 26']);
                }
                ;
                if (attrs.rows[0].gr6 < (attrs.rows[0].gr33 + attrs.rows[0].gr34 + attrs.rows[0].gr35)) {
                    errors.push(['gr32', 'гр. 6 ≥ гр. 33 + 34 + 35']);
                    errors.push(['gr33', 'гр. 6 ≥ гр. 33 + 34 + 35']);
                    errors.push(['gr34', 'гр. 6 ≥ гр. 33 + 34 + 35']);

                }
                ;
                if (attrs.rows[0].gr6 > (attrs.rows[0].gr27 + attrs.rows[0].gr28 + attrs.rows[0].gr29 + attrs.rows[0].gr30 + attrs.rows[0].gr31 + attrs.rows[0].gr32+ attrs.rows[0].gr36)) {
                    errors.push(['gr27', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31 + 32 + 36']);
                    errors.push(['gr28', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32 + 36']);
                    errors.push(['gr29', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32 + 36']);
                    errors.push(['gr30', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32 + 36']);
                    errors.push(['gr31', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32 + 36']);

                }
                ;
            }
            else if(this._model == 'mprPD'){
                if(attrs.rows[0].gr13 != (attrs.rows[0].gr4+attrs.rows[0].gr7+attrs.rows[0].gr10)){
                    errors.push(['gr13','гр. 13 = гр. 4 + 7 + 10']);
                    errors.push(['gr13','гр. 13 = гр. 4 + 7 + 10']);
                    errors.push(['gr13','гр. 13 = гр. 4 + 7 + 10']);

                };

                if(attrs.rows[0].gr14 != (attrs.rows[0].gr5+attrs.rows[0].gr8+attrs.rows[0].gr11)){
                    errors.push(['gr14','гр. 14 = гр. 5 + 8 + 11']);
                    errors.push(['gr14','гр. 14 = гр. 5 + 8 + 11']);
                    errors.push(['gr14','гр. 14 = гр. 5 + 8 + 11']);

                };
            }
            else if(this._model == 'deathm'){
                if(attrs.rows[0].gr29 < attrs.rows[0].gr30){
                    errors.push(['gr29','гр. 29 >= гр. 30']);
                }
                if(attrs.rows[0].gr17 < attrs.rows[0].gr18){
                    errors.push(['gr17','гр. 17 >= гр. 18']);
                }
                if(attrs.rows[0].gr22 < (attrs.rows[0].gr23+attrs.rows[0].gr24+attrs.rows[0].gr25)){
                    errors.push(['gr22','гр. 22 >= гр. 23 + 24 + 25 ']);
                }
                if(attrs.rows[0].gr10 < (attrs.rows[0].gr11+attrs.rows[0].gr12+attrs.rows[0].gr13)){
                    errors.push(['gr10','гр. 10 >= гр. 11 + 12 + 13 ']);
                }
                if(attrs.rows[0].gr6 < (attrs.rows[0].gr8+attrs.rows[0].gr9+attrs.rows[0].gr10+attrs.rows[0].gr14
                    +attrs.rows[0].gr15+attrs.rows[0].gr16+attrs.rows[0].gr17+attrs.rows[0].gr19)){
                    errors.push(['gr6','гр. 6 >= гр. 8 + 9 + 10 + 14 + 15 + 16 + 17 + 19 ']);
                }
                if(attrs.rows[0].gr7 < (attrs.rows[0].gr20+attrs.rows[0].gr21+attrs.rows[0].gr22+attrs.rows[0].gr26
                    +attrs.rows[0].gr27+attrs.rows[0].gr28+attrs.rows[0].gr29+attrs.rows[0].gr31)){
                    errors.push(['gr7','гр. 7 >= гр. 20 + 21 + 22 + 26 + 27 + 28 + 29 + 31 ']);
                }
                if((attrs.rows[0].gr3+attrs.rows[0].gr4+attrs.rows[0].gr5)!= (attrs.rows[0].gr6+attrs.rows[0].gr7)){
                    errors.push(['gr3','гр. 3 + 4 + 5 == гр. 6 + 7']);
                }
                if(attrs.rows[0].gr2 != (attrs.rows[0].gr3+attrs.rows[0].gr4+attrs.rows[0].gr5)){
                    errors.push('gr2','гр. 2 == гр. 3 + 4 + 5 ');
                }
            }

            if(errors.length>0){
                return errors;//errors;
            }

        },
        validateDate: function(date,mtype,rtype,callback){
            var user = this.get('user');

            var data = {mtype:mtype,rtype:rtype,type: this._model,inputdate:date,division:user.division,userid:user._id};
            var vd = $.ajax({
                url : '/vDate',
                data : data,
                type : 'POST'
            });
            vd.done(function(response){
                callback(response);
            });
            vd.fail(function(){
                callback("Ошибка");
            });
        },
        /*unsetExtra: function(){
            this.unset("info","silent");
            this.unset("table","silent");
            this.unset("type","silent");
            this.unset("user","silent");
        },
        save: function(attrs, options) {

            //options.patch = true;
            // Proxy the call to the original save function
            var a=12;
            this.unsetExtra();
            Backbone.Model.prototype.save.call(this, attrs, options);
        }*/

    });
    return  Model;
});