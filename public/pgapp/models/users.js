// Filename: models/users
define([
    'backbone'
], function(Backbone){
    var userModel = Backbone.Model.extend({
        urlRoot: '/rest/users',
        initialize: function() {
            // Assign the Deferred issued by fetch() as a property
            if(this.get('id'))
                this.deffetch();

        },
        deffetch:function(){
            this.deferred = this.fetch();
            return this.deferred;
        }
    });
    // Return the model for the module
    return userModel;
});