define(["jquery","backbone","text!/app/templates/login.ejs"],function($,Backbone,loginTpl) {


   return function(el){
       var LoginView = Backbone.View.extend({
           el: el,
           template: _.template(loginTpl),
           events:{
               'click button#submitlogin': 'renderTpl'
           },
           initialize: function () {
               var _this =this;
               $.get( "/orgmN", function( data ) {
                   var result = JSON.parse(data);
                   _this.$el.html(_this.template(result));
               });

           },
           renderTpl:function(){
               var _this = this;
               var user = $('.username option:selected',this.el ).text().trim();
               var password = $('.password',this.el ).val().trim();
               var jqxhr = $.post( "/auth",{username:user,password:password}, function(res) {
                   $('.alert',_this.el).html('').hide();
                   console.log(res);

                }).done(function(){})
                .fail(function(res) {
                       console.log(res.responseText);
                $('.alert',_this.el).html(res.responseText).show();

                //console.log(res);
                //callback(res);
                });
           }
       });
       var view = new LoginView();
   };
});