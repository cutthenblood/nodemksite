// Filename: collections/users
define([
    'underscore',
    'backbone',
    // Pull in the Model module from above
    'models/users'
], function(_, Backbone, UserModel){
    var UsersCollection = Backbone.Collection.extend({
        //url: '/rest/users',
       // model: new UserModel,
       /* initialize: function(division) {
            // Assign the Deferred issued by fetch() as a property

            this.deferred = this.fetch();
        }*/
    });
    // You don't usually return a collection instantiated
    return UsersCollection;
});
