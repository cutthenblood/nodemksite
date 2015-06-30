define([

    'backbone',
    'router'
], function( Backbone, Router){

    var SessionModel = Backbone.Model.extend({

        initialize : function(){
            //Ajax Request Configuration
            //To Set The CSRF Token To Request Header
           /* $.ajaxSetup({
                headers : {
                    'X-CSRF-Token' : $('meta[name="csrf-token"]').attr('content')
                }
            });*/

            //Check for sessionStorage support
            if(Storage && sessionStorage){
                this.supportStorage = true;
            }
        },

        get : function(key){
            if(this.supportStorage){
                var data = sessionStorage.getItem(key);
                if(data && data[0] === '{'){
                    return JSON.parse(data);
                }else{
                    return data;
                }
            }else{
                return Backbone.Model.prototype.get.call(this, key);
            }
        },


        set : function(key, value){
            if(this.supportStorage){
                sessionStorage.setItem(key, value);
            }else{
                Backbone.Model.prototype.set.call(this, key, value);
            }
            return this;
        },

        unset : function(key){
            if(this.supportStorage){
                sessionStorage.removeItem(key);
            }else{
                Backbone.Model.prototype.unset.call(this, key);
            }
            return this;
        },

        clear : function(){
            if(this.supportStorage){
                sessionStorage.clear();
            }else{
                Backbone.Model.prototype.clear(this);
            }
        },

        login : function(credentials,callback){
            var that = this;
            var login = $.ajax({
                url : '/auth',
                data : credentials,
                type : 'POST'
            });
            login.done(function(response){
                that.set('authenticated', true);
                that.set('division',response.division);
                that.set('user', JSON.stringify(response));
                Backbone.history.navigate('main', { trigger : true });
                callback();
            });
            login.fail(function(){
                callback("Ошибка");
            });
        },

        logout : function(callback){
            var that = this;
            $.ajax({
                url : '/logout',
                type : 'DELETE'
            }).done(function(response){
                //Clear all session data
                that.clear();
                //Set the new csrf token to csrf vaiable and
                //call initialize to update the $.ajaxSetup
                // with new csrf
                //csrf = response.csrf;
                that.initialize();
                callback();
            });
        },


        getAuth : function(callback){
            var that = this;
            var Session = this.fetch();

            Session.done(function(response){
                that.set('authenticated', true);
                that.set('user', JSON.stringify(response));
            });

            Session.fail(function(response){
                response = JSON.parse(response.responseText);
                that.clear();
                csrf = response.csrf !== csrf ? response.csrf : csrf;
                that.initialize();
            });

            Session.always(callback);
        }
    });

    return new SessionModel();
});