// Filename: behaviors/admin
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'validator',
    'select2',
    'datepicker',
    'core/orgmViewUtility',
    'text!templates/whoinputTpl.ejs',
    'pako',
    'core/utls',
    'schemas/datesScm'
], function($, _, Backbone,Mn,Validator,S2,Picker,Utility,resultTpl,Pako,Utls,dateScm){

    var adminBeh = Mn.Behavior.extend({
        events: {
            'change select#monitoring': 'monitChange',
            'click button.whoinput': 'renderwhoinput',
            'click button.report': 'getReport',
            'change input#all':     'chkbxall'

        },
        chkbxall: function(e){
            if(e.currentTarget.checked)
            {
                $("#mo > option").prop("selected","selected");
                $("#mo").trigger("change");
            }

            else
            {
                $("#mo > option").removeAttr("selected");
                $("#mo").trigger("change");
            }

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

            var data = {
                kstart:$('#kstart option:selected').text(),
                kend:$('#kend option:selected').text(),
                ystart:$('#ystart option:selected').text(),
                yend:$('#yend option:selected').text(),
                type:$('#monitoring option:selected').val()};
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
        getReport: function(button){
            button.preventDefault();
            $('#alert').html('');
            var mo =[];
            $('#mo option:selected').each(function(){
                mo.push($(this).val())
            });
            var data = {
                start:$('#dateStart').data("DateTimePicker").date().format('DD.MM.YYYY'),
                end:$('#dateEnd').data("DateTimePicker").date().format('DD.MM.YYYY'),
                mos:mo,
                type:$('#monitoring option:selected').val()};
            Utls.uploadFile('/report/',"cp",Array.prototype.join.call(Pako.gzip(JSON.stringify(data))));
        },
        onRender: function(){
            var _this = this;
            var type = $('#monitoring option:selected').val();
            $('.date').each(function(dt) {
                var dtp = $(this).data('DateTimePicker');
                if(dtp)
                    $(this).data('DateTimePicker').options(dateScm[type]);
                else
                    $(this).datetimepicker(dateScm[type]);

            });
            $('#mo').select2();




        }

    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.adminB = adminBeh;
    return adminBeh;

});