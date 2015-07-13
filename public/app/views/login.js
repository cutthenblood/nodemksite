// Filename: views/login
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'collections/users',
    'text!templates/loginTpl.ejs',
    'text!templates/loginRegisterTpl.ejs',
    'models/session',
    'behaviors/login',
    'select2',
    'validator'

], function($,_, Backbone,Mn,UsersCollection, template,register,LoginBeh,Session,s2,validator){
    var loginView = Mn.ItemView.extend({
        el: $('#container'),
        name:'loginView',
        template: _.template(template),
        registerTemplate: _.template(register),
        collection:new UsersCollection(),
        behaviors: {
            'loginB': LoginBeh

        },
        initialize: function(){
            var model =  Backbone.Model.extend({});
            this.model  = new model();
        },
        render: function(){
            console.log('login render');

            var _this = this;
            this.collection.deferred
                .done(function () {
                    _this.users = this.collection;
                    var data = {users:this.collections,message:''};
                    var compiledTemplate = _.template( template, data );
                    _this.$el.html( compiledTemplate );
                    $('#userlist').select2();
                    $('.alert').hide();
                    console.log('login render p.done');
                });
        }

    });
    // Our module now returns our view
    return loginView;
});