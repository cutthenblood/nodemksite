require.config({
    paths: {
        //tries to load jQuery from Google's CDN first and falls back
        //to load locally
        "text": '/requirejs-text/text',
        "jquery":'/jquery/dist/jquery.min' ,
       "underscore": "/underscore/underscore",
       "backbone": "/backbone/backbone",
       "vow": "/vow/vow.min",
        "bootstrapValidator" :"/bootstrapValidator/dist/js/bootstrapValidator",
       "moment": "/moment/moment",
       "bootstrap-datetimepicker": "/eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker",
       "bootstrap-datetimepicker.ru": "/eonasdan-bootstrap-datetimepicker/src/js/locales/bootstrap-datetimepicker.ru"


    },
    shim: {
        "backbone": {
            //loads dependencies first
            deps: ["jquery", "underscore"],
            //custom export name, this would be lowercase otherwi
            exports: "backbone"
        },
        "bootstrapValidator": {
            //loads dependencies first
            deps: ["jquery"],
            //custom export name, this would be lowercase otherwise
            exports: "bootstrapValidator"
        },
        "bootstrap-datetimepicker": {
            //loads dependencies first
            deps: ["jquery","bootstrap-datetimepicker.ru"],
            //custom export name, this would be lowercase otherwise
            exports: "bootstrap-datetimepicker"
        }

    }
});
requirejs(['jquery','backbone','./login'],
    function   ($,Backbone,login) {
        var MainView = Backbone.View.extend({
            el: 'body',
            initialize: function () {
                $('.navbar',this.$el).hide();
                login('.loginForm');
            }
        });

        var mainView = new MainView();
    });
