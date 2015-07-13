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
        template : function(serialized_model) {
            return _.template(template)({
                user:serialized_model.user,
                menu : menu[serialized_model.user.division]
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