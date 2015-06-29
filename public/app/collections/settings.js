// Filename: models/settings
define([
    'backbone'
], function(Backbone){
    var settingsModel = Backbone.Model.extend({
        urlRoot: '/rest/settings'
    });
    // Return the model for the module
    return new settingsModel();
});