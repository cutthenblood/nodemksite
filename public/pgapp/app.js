// Filename: app.js
define([
    'jquery',
    'underscore',
    'marionette',
    'router',
], function( $,_, Mn,Router){
    var app = Mn.Application.extend({
        initialize: function() {

            Router.initialize();
        }
    });

    Mn.Behaviors.behaviorsLookup = function() {
        return window.Behaviors;
    };
    return new app();
});