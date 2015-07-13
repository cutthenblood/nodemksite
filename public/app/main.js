// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
    paths: {
        jquery: '/jquery/dist/jquery',
        lodash: '/lodash/lodash',
        underscore: '/underscore/underscore',
        backbone: '/backbone/backbone',
        marionette:'/marionette/lib/backbone.marionette',
        routefilter:'/routefilter/dist/backbone.routefilter',
        text: '/requirejs-text/text',
        select2: "/select2/dist/js/select2",
        bootstrap:"/bootstrap/dist/js/bootstrap",
        validator:"/bootstrap-validator/dist/validator.min",
        validator2:"/jquery-form-validator/form-validator/jquery.form-validator.min",
        datepicker:"/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
        moment:"/moment/moment",
        momentlocale:"/moment/locale/ru",
        pako:"/pako/dist/pako.min"


    },
    shim: {
        "backbone": {
            //loads dependencies first
            deps: ["jquery", "underscore"],
            //custom export name, this would be lowercase otherwi
            exports: "backbone"
        },
        "select2": {
            deps: ["jquery"],
            exports: "jquery"
        },
        routefilter: {
            deps: ["backbone"],
            exports:"routefilter"
        },
        marionette: {
            deps: ["backbone","routefilter"],
            exports:"Marionette"
        },
        datepicker: {
            deps: ['jquery', 'bootstrap', 'moment','momentlocale']
            /*init: function (moment) {
                window.moment = moment;
            }*/
        },

        'bootstrap/affix':      { deps: ['jquery'], exports: '$.fn.affix' },
        'bootstrap/alert':      { deps: ['jquery'], exports: '$.fn.alert' },
        'bootstrap/button':     { deps: ['jquery'], exports: '$.fn.button' },
        'bootstrap/carousel':   { deps: ['jquery'], exports: '$.fn.carousel' },
        'bootstrap/collapse':   { deps: ['jquery'], exports: '$.fn.collapse' },
        'bootstrap/dropdown':   { deps: ['jquery'], exports: '$.fn.dropdown' },
        'bootstrap/modal':      { deps: ['jquery'], exports: '$.fn.modal' },
        'bootstrap/popover':    { deps: ['jquery'], exports: '$.fn.popover' },
        'bootstrap/scrollspy':  { deps: ['jquery'], exports: '$.fn.scrollspy' },
        'bootstrap/tab':        { deps: ['jquery'], exports: '$.fn.tab'        },
        'bootstrap/tooltip':    { deps: ['jquery'], exports: '$.fn.tooltip' },
        'bootstrap/transition': { deps: ['jquery'], exports: '$.fn.transition' }
    }

});

require([

    // Load our app module and pass it to our definition function
    'app',
], function(App){
    // The "app" dependency is passed in as "App"

    App.start();
});