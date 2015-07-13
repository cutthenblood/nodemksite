// Filename: views/mprPD
define([

    'lodash',
    'backbone',
    'schemas/mprPDScm',
    // Using the Require.js text! plugin, we are loaded raw text
    // which will be used as our views primary template
    'text!templates/project/list.html'
], function( _, Backbone, scm, template){
    var ProjectListView = Backbone.View.extend({
        el: $('#content'),
        render: function(user){
            // Using Underscore we can compile our template with data
            var data = {user:user,'table':scm};
            var compiledTemplate = _.template( template, data );
            // Append our compiled template to this Views "el"
            this.$el.html( compiledTemplate );
        }
    });
    // Our module now returns our view
    return ProjectListView;
});