// Filename: models/kadry
define([
    'backbone'
], function(Backbone){
    var Model = Backbone.Model.extend({
        url: '/kadry/save'

    });
    // Return the model for the module
    return Model;
});