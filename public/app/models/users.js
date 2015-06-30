// Filename: models/users
define([
    'backbone'
], function(Backbone){
    var userModel = Backbone.Model.extend({
        urlRoot: '/rest/users'
    });
    // Return the model for the module
    return userModel;
});