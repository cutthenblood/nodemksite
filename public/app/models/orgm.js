// Filename: models/orgm
define([
    'backbone'
], function(Backbone){
    var Model = Backbone.Model.extend({
        url: '/kadry/save'
    });
    // Return the model for the module
    return new Model();
});