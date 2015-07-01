// Filename: views/main
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/mainTpl.ejs',
    'views/menu',
    'bootstrap',
    'schemas/menu'
], function($, _, Backbone,Mn, template,MenuView,bootstrap,menu){
    var LayoutView = Mn.LayoutView.extend({
        el: '#container',
        template: _.template(template),
        regions: {
            menu: "#menu",
            content:"#content"
        },
        name:'mainLayout',

        initialize: function(user){
            this.user = user;
            console.log('init main');
        }

    });
    // Our module now returns our view
    return LayoutView;
});