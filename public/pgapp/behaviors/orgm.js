// Filename: behaviors/orgm
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'validator',
    'core/orgmViewUtility'
], function($, _, Backbone,Mn,validator,Utility){
    var date =
    {'mpr':{format: 'DD.MM.YYYY',
        useCurrent: false,
        locale: 'ru-RU'},
        'mprPD':{ viewMode: 'years',
            format: 'MM/YYYY',
            locale: 'ru-RU',
            useCurrent: false},
        'deathm':{   format: 'DD.MM.YYYY',
            useCurrent: false,
            locale: 'ru-RU'},
    'mlodn':{
        format: 'DD.MM.YYYY',
        useCurrent: false,
        locale: 'ru-RU'
    }};

    var OrgmBeh = Mn.Behavior.extend({
        events: {
            'change #mtype':'rtypeshow'
        },
        rtypeshow: function(){
            this.validateDate();
            ($('.row_rtype').css('display')== 'none')?$('.row_rtype').show():$('.row_rtype').hide();

        },
        scrolltotop: function(){
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },
        datevalid: false,
        onShow: function(){
            var _this = this;
            this.datevalid==false;
            $('#mainaddform').validator();
            $('.date').each(function(dt) {
                $(this).datetimepicker(date[_this.view.type.type]);
            });
            $('#mainaddform').validator().on('submit', function (e) {
                e.preventDefault();
                _this.save();
                //_this.saveform(validator,validator.getSubmitButton().attr('name'));
            });
            $("#date").on("dp.change",function (e) {
                _this.validateDate();
            });

            $("#rtype").on("change",function (e) {
                _this.validateDate();
            });
        },
        validateDate: function(){
            var _this = this;
            //todo сделать))
            _this.datevalid = true;
            this.view.model.validateDate(
                $('#date').data("DateTimePicker").date().startOf('day').format('DD.MM.YYYY'),
                $('#mtype option:selected').text().trim(),
                ($('.row_rtype').css('display')== 'none')?null:$('#rtype option:selected').text().trim(),
                function(resp){
                var data = JSON.parse(resp);
                if(data.res=="1"){
                    _this.datevalid = true;
                    $('#alert').html('');}
                else {
                    _this.datevalid = data.msg;

                    $('#alert').html('<div class="alert alert-danger" role="alert">'+data.msg+'</div>');
                    _this.scrolltotop();
                }
            });
        },

        save: function(){
            $('#alert').html('');
            var dt = $('#date').data("DateTimePicker").date();
            if(!dt || !dt.isValid() || this.datevalid!=true){
                $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка в дате - '+this.datevalid+'</div>');
                this.scrolltotop();
            } else {
                $('#alert').html('');
                var dfate = 'err';
                var util = new Utility({inputdate:dt,type:this.view.model._model});

                this.view.model.set('inputdate',util.save_fn());
                this.view.model.set('type',this.view.model._model);
                var user = this.view.model.get('user');
                var row={};
                //row["username"]=user.username;
                //row["mo"]=$('#mo option:selected').text().trim().replace(/ {2,}/g,' ');

                row['date'] =moment().format('DD.MM.YYYY');
                row['mtype'] = $('#mtype option:selected').text().trim();
                if(($('.row_rtype').css('display')!= 'none'))
                    row['rtype'] = $('#rtype option:selected').text().trim();
                $('form input[name^="gr"]').each(
                    function (index) {
                        var input = $(this);
                        var gr = input.attr('name');
                        if(gr.indexOf('gr')==-1)
                            return;
                        if(input.val()=="")
                            row[gr] = 0;
                        else
                            row[gr]= parseInt(input.val());

                    });
                this.view.model.set("rows",[row]);
                if ( !this.view.model.isValid()) {
                    console.log('not valid');
                    this.view.model.validationError.forEach(function(item){
                        var selector = 'input[name="'+item[0]+'"]';
                        $(selector).val("Ошибка - "+item[1]);
                    });
                    $('#mainaddform').validator('validate');
                    this.scrolltotop();

                } else {
                    console.log('valid');
                    this.view.model.unset('info');
                    this.view.model.unset('table');

                   this.view.model.save();
                    this.scrolltotop();
                   alert('Ваши данные успешно сохранены!');
                   Backbone.history.navigate('', { trigger : true });
                }
            }
        }

    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.orgmB = OrgmBeh;
    return OrgmBeh;

});