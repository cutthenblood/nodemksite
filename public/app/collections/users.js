// Filename: collections/users
define([
    'underscore',
    'backbone',
    // Pull in the Model module from above
    'models/users'
], function(_, Backbone, UserModel){
    var UsersCollection = Backbone.Collection.extend({
        url: '/rest/users',
        model: UserModel,
        initialize: function() {
            // Assign the Deferred issued by fetch() as a property
            this.deferred = this.fetch();
        },
        getByDivision:function(division){
            return this.models.filter(function(itm){
                var user = itm.toJSON();
                if(user.division == division)
                    return itm;
            })
        }
    });
    // You don't usually return a collection instantiated
    return UsersCollection;
});
