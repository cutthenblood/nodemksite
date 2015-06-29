// Filename: views/main
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/users',
    'text!templates/mainTpl.ejs',
    'core/baseview',
    'bootstrap',
    'schemas/menu'
], function($, _, Backbone,users, template,BaseView,bootstrap,menu){
    var MainView = BaseView.extend({
        el: $('#menu'),
        name:'main',
        template: _.template(template),
        initialize: function(user){
            this.user = user;
        },
        render: function(callback){
            this.$el.append(this.template({user:this.user}));
            var html = '';
            menu[this.user.division].forEach(function(itm){
                if(itm.name=='divider')
                    html+='<li class="divider"></li>';
                else
                    html+='<li><a href="#'+itm.href+'">'+itm.name+'</a></li>';

            });

            $('#mainmenu').html(html);
            callback();

        }
    });
    // Our module now returns our view
    return MainView;
});