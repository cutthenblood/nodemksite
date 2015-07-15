// Filename: behaviors/login
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'models/session',
    'validator'
], function($, _, Backbone,Mn,Session,Validator){


    var LoginBeh = Mn.Behavior.extend({
        events:{
            'click button#loginButton': 'login',
            'click button.register':    'register',
            'click button.otdel':       'otdelSelect'
        },
        otdelSelect: function(e){
            var val = e.currentTarget.value;
            this.otdel = val;
            this.view.model.set("otdel",e.currentTarget.value);
            $('.otdel').each(function(){
                $( this ).removeClass("btn-primary");
                $( this ).addClass("btn-default");
            });
            $( e.currentTarget ).removeClass("btn-default");
            $( e.currentTarget ).addClass("btn-primary");
            var html = '<select class="form-control" name="username" id="userlist" autofocus>';
            if(val == 'kadry'){
                this.view.collection.models.forEach(function(user) {
                    var cur = user.toJSON();
                    if(cur.division=='kadry'){
                        html += '<option>' + cur.username + '</option>'
                    }
                })
            }
            if(val=='orgm' || val=='mlo'){
                this.view.collection.models.forEach(function(user) {
                    var cur = user.toJSON();
                    if(cur.division!='kadry') {
                        html += '<option>' + cur.username + '</option>';
                    }
                })
            }
            html+='<option>Администратор</option>';
            $('.users').html(html);
            $('#userlist').select2();

        },
        login: function(e){
            var _this = this;
            e.preventDefault();
            var email = $('#email').val();
            var password = $('#password').val();
            Session.login({'username':$('#userlist').val(),'password':$('input[name=password]').val()},function(err){
                if(err)
                {$('.alert').show();
                    $('.alert').html(err);}
                Session.set('otdel',_this.otdel);
            });

        },
        register: function(e){
            console.log('login register');
            e.preventDefault();
            e.stopImmediatePropagation();
            var otdel = this.view.model.get('otdel');
            if(!otdel) {
                alert('Выберите отдел');
                return;

            } else {
                var username = $('#userlist option:selected').text().trim().replace(/ {2,}/g,' ');
                if(!username) {
                    alert('Выберите организацию');
                    return;
                }
                else {
                    this.username = username;
                    var _this = this;
                    var data = {username:username,otdel:otdel,message:''};

                    _this.$el.html(  this.view.registerTemplate(data) );
                    $('#regform').validator();

                    $('#regform').validator().on('submit', function (e) {
                        if (e.isDefaultPrevented()) {
                            return;
                        } else {
                            _this.regsave(e);
                        }
                    })
                }

            }
        },
        regsave: function(e){
            e.preventDefault();
            var dis = $(e.currentTarget).attr('disabled');
            var reguser = $.ajax({
                url : '/reguser',
                data : {otdel:this.otdel,username:this.username,password:$('#inputPassword').val()},
                type : 'POST'
            });
            reguser.fail(function(res) {
                alert(res.responseText);

            });
            window.location = '/orgmRjs';
        }


    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.loginB = LoginBeh;
    return LoginBeh;

});