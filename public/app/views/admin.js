// Filename: views/admin
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/adminTpl.ejs',
    'text!templates/adminKadryTpl.ejs',
    'behaviors/adminOrgm',
    'behaviors/adminKadry',
    'models/session',
    'select2',
    'validator',
    'collections/users'

], function($,_, Backbone,Mn, templateOrgm,templateKadry,AdminBehOrgm,AdminBehKadry,Session,s2,validator,UsersCollection){
    var adminView = Mn.ItemView.extend({
       // templates: {kadry:_.template(templateKadry), orgm: _.template(templateOrgm)},
        collection: new UsersCollection(),
        template : function(sm) {
            switch(sm.model.get('otdel')){
                case 'orgm':{

                    return _.template(templateOrgm); break;}
                case 'kadry':{
                    return _.template(templateKadry)({
                        mos:sm.collection.getByDivision('kadry')
                    }); break;}
//                    var coll = new UsersCollection();
//                    var p  = coll.fetch();
//                    p.done(function(){
//                        return _.template(templateKadry)({
//                            mos: coll.getByDivision('kadry')
//                        });
//                    });
                   // break;}
            }
        },
        behaviors:  function() {
                    switch( Session.get('otdel')){
                        case 'orgm':{ return {'adminBehOrgm':AdminBehOrgm}; break;}
                        case 'kadry':{return {'adminBehKadry':AdminBehKadry}; break;}
                    }
                },
        serializeData: function(){
            return {
                "model": this.model,
                "collection":this.collection
            }
        },
        initialize: function(){
            var model =  Backbone.Model.extend({
                //otdel: this.otdel
            });

            this.model = new model();
            this.model.set('otdel',Session.get('otdel'));


           /* switch( this.model.get('otdel')){
                case 'orgm':{ this.behaviors = {'adminB':AdminBehOrgm}; break;}
                case 'kadry':{this.behaviors = {'adminB':AdminBehKadry}; break;}
            }*/

        }



    });
    // Our module now returns our view
    return adminView;
});