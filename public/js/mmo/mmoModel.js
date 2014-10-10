load({
        ofosvkrTpl: '/templates/mmo/ofosvkrTpl.ejs'
    },
    function (loaded) {
        console.log(loaded);
        var mmoOfosvkrModel = Backbone.Model.extend({
            url: '/mmo/ofosvkr/uploadform',
            validate: function (attrs) {
            }

        });
        var ofosvkrModel = new mmoOfosvkrModel();
        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'ofosvkr':loaded.ofosvkrTpl},
            events:{
                'click button#ofosvkr': 'renderofosvkr',
                'click button#ErrorModelClose': 'ErrorModelClose',

            },
            ErrorModelClose: function() {
                if (this.noreload==false)
                    window.location.reload();
            },
            initialize: function () {
            },
            renderDateError: function(error){
                this.dateok=false;
                $('#ErrorModalText').html(error);
                $('#ErrorModal').modal();
            },
            validateDate: function(date){
                if (!date.isValid == undefined) _this.renderDateError("<h3>неправлиьная дата</h3>");
                var _this= this;
                var now = moment();
                var weekday = now.day();
                var diff = moment().diff(date, 'days');
                var time = moment.duration(moment().diff(date.startOf('day'))).asHours();
                if (time<0) return _this.renderDateError("<h3>Вводить данные за дату в будущем запрещено</h3>");
                _this.dateok=true;
                return;

            },
            scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            renderofosvkr: function () {
                console.log('renderofosvkr');
                $('#report').html(this.template.ofosvkr({'table':ofosvkrSchema}));

                $('.date').datetimepicker({
                    //defaultDate: moment().format(),
                    pickTime: false,
                    language: 'ru'
                });
                var _this=this;
                this.noreload=false;
                _this.dateok=false;
                $(".date").on("dp.change",function (e) {
                    _this.noreload=true;
                    $('#mainaddform').bootstrapValidator('revalidateField','dates[]');
                    var dt = $(this).data("DateTimePicker").getDate().format("DD.MM.YYYY");
                    _this.validateDate(_this.validateDate(moment(dt,"DD.MM.YYYY")));

                });
                this.validator = $('#mainaddform').bootstrapValidator({
                    fields: {
                        'dates[]': {
                            validators: {
                                callback: {
                                    message: 'неправильная дата',
                                    callback: function(value, validator) {
                                        if (value.length < 2) return true;
                                        var m = new moment(value, 'DD.MM.YYYY');
                                        // Check if the input value follows the MMMM D format
                                        if (!m.isValid()) {
                                            return false;
                                        }
                                        // US independence day is July 4
                                        return true;
                                    }
                                }
                            }}}

                }).on('success.form.bv', function(e) {
                    // Prevent submit form
                    e.preventDefault();

                    var $form     = $('#mainaddform'),
                        validator = $form.data('bootstrapValidator');
                        _this.saveform(validator,validator.getSubmitButton().attr('name'));
                });
                return this;
            },
            saveform: function (validator,submittype) {
                if (this.dateok == false){
                    this.noreload=true;
                    this.renderDateError("<h3>Неправильная дата</h3>");
                    this.scrolltotop();
                    return;
                };
                //var validator = $('#mainaddform').data('bootstrapValidator');
                //var vl = validator.validateField('gr5');
                var arr = [];
                ofosvkrModel.set('inputdate',$('#date').data("DateTimePicker").getDate().valueOf());
                var row={};
                row["username"]=$('#motitle').text().trim().replace('\n','');
                //row["mo"]=$('#mo option:selected').text().trim();
                row['date']=new Date();
                row['date'] =row['date'].valueOf();
                //row['group'] = $('#mo option:selected').val();
                $('form input[type="text"],form input[type="date"],form textarea').each(
                    function (index) {
                        var input = $(this);
                        var gr = input.attr('name');
                        if(gr.indexOf('gr')==-1 && gr!='dates[]'){
                            return;
                        }
                        if (input.attr('data-bv-integer'))
                            row[gr]= parseInt(input.val());
                        else if (gr=='dates[]')
                            row[input.attr('fieldName')]= moment(input.val()).valueOf();
                        else
                            row[gr] = input.val();

                    });

                ofosvkrModel.set("rows",[row]);
                ofosvkrModel.save();
                alert('Ваши данные успешно сохранены!');
                if(submittype=="submitexit"){
                    //window.location.href = "/orgm/orgmIndex";
                    $('#report').html('');
                    return this;
                } else
                {
                    ofosvkrModel.clear();

                    var form =  $('#mainaddform');
                    form[0].reset();
                    form.data('bootstrapValidator').resetForm();
                    this.scrolltotop();
                }
             }
        });
        var mainView = new MainView();

    });

