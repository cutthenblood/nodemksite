load({
        ofosvkrTpl: '/templates/mmo/ofosvkrTpl.ejs'
    },
    function (loaded) {
        console.log(loaded);
        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'ofosvkr':loaded.ofosvkrTpl},
            events:{
                'click button#ofosvkr': 'renderofosvkr',
                'click button#ErrorModelClose': 'ErrorModelClose'
            },
            ErrorModelClose: function() {
                if (this.noreload==false)
                    window.location.reload();
            },
            initialize: function () {
            },
            renderDateError: function(error){
                $('#ErrorModalText').html(error);
                $('#ErrorModal').modal();
            },
            validateDate: function(date){
                if (date == undefined) return;
                var _this= this;
                var now = moment();
                var weekday = now.day();
                var diff = moment().diff(date, 'days');
                var time = moment.duration(moment().diff(now.startOf('day'))).asHours();
                if (diff<0) return _this.renderDateError("<h3>Вводить данные за дату в будущем запрещено</h3>");
                //if (weekday == 1 && (time>=9 && time<=12)) {
                this.postdate(date.valueOf(),date.add(1,"days").valueOf(),function(res)
                {
                    if (res!="ok")
                        return _this.renderDateError("<h3>Данные за эту дату уже внесены</h3>");
                    else
                    {
                        _this.dateok=true;
                        return;
                    }

                });
                //} else return _this.renderDateError("<h3>Вводить данные разрешено только в понедельник с 9.00 до 12.00</h3>");
            },
            postdate: function(startdate,enddate,callback){
                var username = $('#moname').text();
                var jqxhr = $.post( "/mmo/validateDate",{"startdate":startdate,"enddate":enddate,"username":username}, function(res) {
                    console.log(res);
                    callback(res);
                }).done(function(){})
                    .fail(function(res) {
                        console.log(res);
                        callback(res);
                    });
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
                $("#date").on("dp.change",function (e) {

                    var dt = $('#date').data("DateTimePicker").getDate().format("DD.MM.YYYY");
                    _this.validateDate(_this.validateDate(moment(dt,"DD.MM.YYYY")));
                });
                $('.date')
                    .on('dp.change dp.show', function(e) {
                        // Validate the date when user change it
                        $('#mainaddform').bootstrapValidator('revalidateField', e.currentTarget.id);
                    });
                this.validator = $('#mainaddform').bootstrapValidator({

                    submitHandler: function(validator, form, submitButton) {
                        _this.saveform(validator,submitButton.attr('name'));

                    }
                },true);
                return this;
            }
        });
        var mainView = new MainView();

    });

