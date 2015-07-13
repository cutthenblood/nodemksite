// Filename: views/settings
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'text!templates/settingsTpl.ejs',
    'behaviors/settings',
    'collections/settings',
    'models/session',


], function($,_, Backbone,Mn, template,SettingsBeh,SettingsCollection,Session){

    var settingsView = Mn.ItemView.extend({
        template: _.template(template),
        collection: new SettingsCollection(),

        behaviors: {
            'settingsB': SettingsBeh
        },

        onShow: function(){
            console.log('show');

        },
        initialize: function(){
            var _this = this;
            this.collection.deferred
                .done(function () {
                    _this.render();
                });
        },
        render: function(){
            this.$el.html(this.template({}) );
        }


    });
    // Our module now returns our view
    return settingsView;
});