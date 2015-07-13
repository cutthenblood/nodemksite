// Filename: views/main
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/menuTpl.ejs',
    'bootstrap',
    'schemas/menu'
], function($, _, Backbone,Mn, template,bootstrap,menu){
    var MenuView = Mn.ItemView.extend({
        //el:'#menu',
        //template:  _.template(template),
        template : function(sm) {
            return _.template(template)({
                user:sm.user,
                menu : menu[sm.user.role][sm.user.division]
            });
        },
        name:'menuView',
        initialize: function(user){
            var model = Backbone.Model.extend({
            });
            this.model = new model({user:user});
        }
    });
    // Our module now returns our view
    return MenuView;
});