// Filename: behaviors/check
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'validator',
    'select2',
    'datepicker',
    'core/orgmViewUtility',
    'schemas/datesScm',
    'collections/users',
    'text!templates/whoinputTpl.ejs',

], function($, _, Backbone,Mn,Validator,S2,Picker,Utility,date,UsersCollection,resultTpl){


    var adminBehOrgm = Mn.Behavior.extend({
        events: {
            'change select#monitoring': 'monitChange',
            'click button.whoinput': 'renderwhoinput',
            'click button.report': 'getReport',
            'change input#all':     'chkbxall'

        },
        chkbxall: function(e){
            if(e.currentTarget.checked)
                $('#mo').attr('disabled','disabled');
            else
                $('#mo').removeAttr('disabled','disabled');

        },
        viewUsers: function(type){
            var options='';
            this.view.users.forEach(function(usr){
                var user = usr.toJSON();
                if(user.division!='orgm') return;
                  if(type == 'deathm'){
                    options += '<option>' + user.username + '</option>';
                }else {
                    if(user.uz && type =='mprPD')
                        options += '<option>' + user.uz + '</option>'
                    if(user.mo)
                        user.mo.forEach(function (mo) {
                            options += '<option>' + mo.fullname + '</option>'
                        });
                }
            });
            return options;
        },
        monitChange: function(e){
            var type = e.currentTarget.value;
            if(type=='mpr'){
                $('#mo').html(this.viewUsers(type));
                $('.dmdis').removeAttr('disabled','disabled');
            }
            else if(type=='mprPD'){
                $('#mo').html(this.viewUsers(type));
                $('.dmdis').removeAttr('disabled','disabled');
            }
            else if(type == 'deathm'){
                $('#mo').html(this.viewUsers(type));
                $('.dmdis').attr('disabled','disabled');
            }
            $('.date').each(function(dt) {
                var dtp = $(this).data('DateTimePicker');
                if(dtp)
                    $(this).data('DateTimePicker').options(date[type]);
                else
                    $(this).datetimepicker(date[type]);
            });

        },
        renderwhoinput: function(e) {
            var _this = this;
            e.preventDefault();
            $('#whoinput').html('');
            $('#alert').html('');
            var _this=this;
            var dtStart = $('#dateStart').data("DateTimePicker").date();
            var type = $('#monitoring option:selected').val();
            var mo =$('#mo option:selected').text().trim().replace(/ {2,}/g,' ');
            if (!dtStart || !dtStart.isValid()) {
                $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка в дате</div>');
                return;
            }
            var dtEnd = $('#dateEnd').data("DateTimePicker").date();
            if (!dtEnd || !dtEnd.isValid()) {
                $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка в дате</div>');
                return;

            }
            var util = new Utility({type:type,start:dtStart,end:dtEnd,mo:mo,username:mo});
            var data = util.whoinput();
            data.all = $('#all')[0].checked;
            var whoinp = $.ajax({
                url : '/whoinput',
                data : data,
                type : 'POST'
            });

            whoinp.done(function(result){
                if(result.length>0){
                    var mapping=[];
                    var columns=[];
                    //var util = new Utility({type:type});
                    //var info=util.schema(mapping,columns);
                    var data = JSON.parse(result);
                    $('#whoinput').html(_.template(resultTpl,{table:data}));
                    //$('#whoinput').html(_this.view.template.checkResultTpl({info:info,mapping:mapping,columns:columns.sort(function(a,b){return a-b;}),data:data}));
                } else
                    $('#whoinput').html('<h4>Нет данных</h4>');
                //$('#whoinput').html('<h4>Нет данных</h4>');}

            });
            whoinp.fail(function(err){
                $('#alert').html('<div class="alert alert-danger" role="alert">'+err.statusText+'</div>');
                return;

            });
        },
        onShow: function(){

            var _this = this;
            var coll = new UsersCollection();
            var p  = coll.fetch();
            p.done(function(){
                _this.view.users = coll.models;


                _this.monitChange({currentTarget:
                {value:$('#monitoring').val()}});
                $('#mo').select2();

            })
        },
        getReport: function(button){
            button.preventDefault();
            $('#alert').html('');
            $(button.currentTarget).attr('id');
            var type = $('#monitoring option:selected').val();
            var mo = $('#mo option:selected').text().trim().replace(/ {2,}/g,' ');
            var sdate = $('#dateStart').data("DateTimePicker").date();
            var edate = $('#dateEnd').data("DateTimePicker").date();
            var all = $('#all')[0].checked;
            var util = new Utility({all:all,type:type,start:sdate,end:edate,mo:mo});
            var data = util.getReport();
            window.open("/orgm/report/"+JSON.stringify(data), '_blank');
        }
    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.adminBehOrgm = adminBehOrgm;
    return adminBehOrgm;

});