// Filename: collections/settings
define([
    'backbone',
    'marionette',
    'models/settings'
], function(Backbone,Mn,SettingsModel){
    var settingsCollection = Backbone.Collection.extend({
        //url: '/rest/settings',
        model: SettingsModel,
        initialize: function() {
            // Assign the Deferred issued by fetch() as a property
          //  this.deferred = this.fetch();
        }

    });
    // Return the model for the module

    return settingsCollection;
});