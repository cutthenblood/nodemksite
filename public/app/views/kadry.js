// Filename: views/kadry
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'behaviors/kadry',
    'text!templates/kadryTpl.ejs',
    'models/kadry'
], function($, _, Backbone,Mn,KadryBeh, template,KadryModel){
    var KadryView = Mn.ItemView.extend({
        template : _.template(template),
        model:new KadryModel(),
        behaviors: {
           'kadryB': KadryBeh
        },
        isvalid: false,
        name:'kadry'
    });
    // Our module now returns our view
    return KadryView;
});