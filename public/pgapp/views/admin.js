// Filename: views/admin
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/adminTpl.ejs',
    'text!templates/adminKadryTpl.ejs',
    'behaviors/admin',
    'models/session',
    'select2',
    'validator',
    'models/users'

], function($,_, Backbone,Mn, template,templateKadry,AdminBeh,Session,s2,validator,UserModel){
    var adminView = Mn.ItemView.extend({
        template:_.template(template),
       // templates: {kadry:_.template(templateKadry), orgm: _.template(templateOrgm)},
        //collection: new UserModel(Session.get('otdel')),
//        template : function(sm) {
//            switch(sm.model.get('otdel')){
//                case 'orgm':{
//
//                    return _.template(templateOrgm); break;}
//                case 'mlo':{
//                    sm.usermodel.deferred
//                        .done(function () {
//                            return _.template(templateOrgm)({
//                                user:sm.model.get('user'),
//                                mos:sm.usermodel.attributes
//                            });
//                        });
//
//                    break;}
//                case 'kadry':{
//
//                    return _.template(templateKadry)({
//                        mos:sm.collection.getByDivision('kadry')
//                    }); break;}
//
//            }
//        },
        behaviors:  {
            'adminB': AdminBeh

        },
        serializeData: function(){
            return {
                "model": this.model,
                "usermodel":this.usermodel
            }
        },
        initialize: function(){
            var _this = this;
            var model =  Backbone.Model.extend({
                //otdel: this.otdel
            });
            this.usermodel = new UserModel({id:Session.get('otdel')});
            this.model = new model();
            this.model.set('otdel',Session.get('otdel'));
            this.model.set('user',Session.get('user'));
            this.usermodel.deferred.done(function () {
                _this.render();
                $('#mo').select2();


            });

        }



    });
    // Our module now returns our view

    return adminView;
});