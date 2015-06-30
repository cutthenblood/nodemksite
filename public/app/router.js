define([
    'jquery',
    'lodash',
    'marionette',
    'backbone',
    'views/main',
    'views/menu',
    'views/login',
    'views/viewsFactory',
    'views/kadry',
    'views/check',
    'views/admin',
    'views/settings',
    'models/session'
    //'views/users/list'
], function($, _, Mn,Backbone, MainView,MenuView,LoginView,ViewsFactory,KadryView,CheckView,AdminView,SettingsView,Session){
    var AppRouter = Mn.AppRouter.extend({
        routes: {
            "":             "main",
            //"main":         "main",
            "login":        "login",
            "logout":       "logout",
            "mpr":          "mpr",
            "mprPD":        "mprPD",
            "check":        "check",
            "deathm":        "deathm",
            "kadry":        "kadry",
            "admin":        "admin",
            "settings":     "settings",
            '*notFound':    'notFound'
        },
        // Routes that need authentication and if user is not authenticated
        // gets redirect to login page
        noAuth: ['#login'],
        defaultPages:['','#main','#logout'],
        requresAuth : ['','#main','#mpr','#mprPD','#check','#deathm','#admin','#settings'],
       /* access: {
        'kadry':['','#main','#kadry','#logout'],
        'orgm':['','#main','#mpr','#mprPD','#check','#deathm','#logout']},*/
        // Routes that should not be accessible if user is authenticated
        preventAccessWhenAuth : ['#login'],

        before : function(route, params){
            //Checking if user is authenticated or not
            //then check the path if the path requires authentication
            var isAuth = Session.get('authenticated');
            var path = Backbone.history.location.hash;
            if(isAuth){
                var user = Session.get('user');

                var accessPrivil = this.defaultPages.concat(user.privileges.webfaceaccess);
                //if(path = "#admin")
                 //   Session.set('admin',)

                var hasPrivl = _.contains(accessPrivil,path);
                if (isAuth && !hasPrivl){
                    Session.set('redirectFrom', path);
                    Backbone.history.navigate('', { trigger : true });
                    return false;
                } else {
                    this.mainview = new MainView(Session.get('user'));
                    console.log('router');
                    this.mainview.render();
                    this.mainview.getRegion('menu').show(new MenuView(Session.get('user')));

                }
            } else {
                Session.set('redirectFrom', path);
                Backbone.history.navigate('login', { trigger : true });
                if(path!='#login')
                    return false;
            }

        },
        after : function(){
            //empty
        },

        initialize: function(){
            Backbone.history.start();
        },
        notFound: function(){
            window.location = '/orgmRjs';
        },
        menu: function(callback) {
           /* //console.log('main');
            //var user =
            var mainView = new MainView( Session.get('user'));
            this.menuView = mainView;
            mainView.render(callback);
*/
        },
        main: function(view){

           /* if(!this.mainview) {
                this.mainview = new MainView(Session.get('user'));
                console.log('router');
                this.mainview.render();
                this.mainview.getRegion('menu').show(new MenuView(Session.get('user')));
            }
            this.mainview.getRegion('content').show(new ViewsFactory(view));*/

        },
        login: function() {
            var view = new LoginView();
            view.render();
        },
        logout: function() {
            //console.log('loginView');
            Session.logout(function(){
                Backbone.history.navigate('login', { trigger : true });

            });
            //loginView.render();
        },
        mpr: function(){
            this.mainview.getRegion('content').show(new ViewsFactory({type:'mpr'}));
        },
        mprPD: function(){
            this.mainview.getRegion('content').show(new ViewsFactory({type:'mprPD'}));
        },
        deathm: function(){
            this.mainview.getRegion('content').show(new ViewsFactory({type:'deathm'}));
        },
        check: function(){
            this.mainview.getRegion('content').show(new CheckView());
        },
        kadry: function(){
            this.mainview.getRegion('content').show(new KadryView());
        },
        admin: function(){
            this.mainview.getRegion('content').show(new AdminView());
        },
        settings: function(){
            this.mainview.getRegion('content').show(new SettingsView());
        }

    });

    var initialize = function(){
        var app_router = new AppRouter();
        return app_router.initialize;

    };
    return {
        initialize: initialize
    };
});