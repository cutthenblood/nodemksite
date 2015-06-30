// Filename: models/settings
define([
    'backbone'
], function(Backbone){
    var settingsModel = Backbone.Model.extend({
        //url: '/rest/settings',
        /*initialize: function(){
            this.fetch();
        }*/
    });
    // Return the model for the module
    return settingsModel;
});