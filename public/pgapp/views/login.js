// Filename: views/login
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/loginTpl.ejs',
    'text!templates/loginRegisterTpl.ejs',
    'models/session',
    'behaviors/login',
    'select2',
    'validator',
    'models/users'

], function($,_, Backbone,Mn, template,register,LoginBeh,Session,s2,validator,UserModel){
    var loginView = Mn.ItemView.extend({
        el: $('#container'),
        name:'loginView',
        template: _.template(template),
        registerTemplate: _.template(register),
        behaviors: {
            'loginB': LoginBeh

        },
        initialize: function(){
            var model =  Backbone.Model.extend({});
            this.model  = new model();
            this.usermodel = new UserModel();
        }
    });
    // Our module now returns our view
    return loginView;
});