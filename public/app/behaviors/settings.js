// Filename: behaviors/check
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'validator',
    'select2',
    'datepicker',
    'core/orgmViewUtility',
    'schemas/datesScm',
    'models/users',
    'text!templates/whoinputTpl.ejs',

], function($, _, Backbone,Mn,Validator,S2,Picker,Utility,date,SettingsModel,resultTpl){


    var settingsBeh = Mn.Behavior.extend({


    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.settingsB = settingsBeh;
    return settingsBeh;

});