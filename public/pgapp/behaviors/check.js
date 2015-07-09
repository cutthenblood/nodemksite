// Filename: behaviors/check
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'validator',
    'datepicker',
    'core/orgmViewUtility',
    'schemas/datesScm'

], function($, _, Backbone,Mn,Validator,Picker,Utility,date){


    var checkBeh = Mn.Behavior.extend({
        events: {
            'change select#monitoring': 'monitChange',
            'click button.whoinput': 'renderwhoinput'
        },
        monitChange: function(e){
            var type = e.currentTarget.value;
            if(type=='mpr'){
                $('#mo').html(this.view.user.mo.reduce(function (prev, next) {
                    return prev + '<option>' + next.fullname + '</option>'
                }, ''));
                $('#mo').removeAttr('disabled');

            }
            else if(type=='mprPD'){
                if(this.view.user.uz)
                    $('#mo').html('<option>'+this.view.user.uz+'</option>');
                else
                    $('#mo').html(this.view.user.mo.reduce(function(prev,next){
                        return prev +'<option>'+next.fullname+'</option>'
                    },''));
                $('#mo').removeAttr('disabled');

            }
            else if(type == 'deathm'){
                $('#mo').attr('disabled','disabled');
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
            var util = new Utility({type:type,start:dtStart,end:dtEnd,mo:mo,userid:this.view.user._id});
            var whoinp = $.ajax({
                url : '/getinput',
                data : util.whoinput(),
                type : 'POST'
            });

            whoinp.done(function(result){
                    if(result.length>0){
                        var mapping=[];
                        var columns=[];
                        var util = new Utility({type:type});
                        var info=util.schema(mapping,columns);
                        var data = JSON.parse(result);
                        $('#whoinput').html(_this.view.resultTemplate({all:false,info:info,mapping:mapping,columns:columns.sort(function(a,b){return a-b;}),data:data}));
                        //$('#whoinput').html(_this.view.template.checkResultTpl({info:info,mapping:mapping,columns:columns.sort(function(a,b){return a-b;}),data:data}));
                    } else
                        $('#whoinput').html('<h4>Нет данных</h4>');
                        //$('#whoinput').html('<h4>Нет данных</h4>');}

                });
            whoinp.fail(function(response){
                $('#alert').html('<div class="alert alert-danger" role="alert">'+response.statusText+'</div>');
                return;

            });
        },
    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.checkB = checkBeh;
    return checkBeh;

});