// Filename: app.js
define([
    'jquery',
    'underscore',
    'marionette',
    'router', // Request router.js
], function( $,_, Mn,Router){


    var app = Mn.Application.extend({
        initialize: function() {

            Router.initialize();
        }
    });

    Mn.Behaviors.behaviorsLookup = function() {
        return window.Behaviors;
    };

  /*  var initialize = function(){
        // Pass in our Router module and call it's initialize function
        Router.initialize();
    }*/

    return new app();
});