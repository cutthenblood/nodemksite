load({
        mprTpl: '/templates/orgm/orgmMprAdminTpl.ejs'
    },
    function (loaded) {
        var monitoring = "";

        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'mpr':loaded.mprTpl},
            events:{
                'click button#mpr': 'render',
                'click button#mprPD': 'render',
                'click button#ErrorModelClose': 'ErrorModelClose',
                'click [name=submitBtn]': 'report',
                'click button#whoinput': 'whoinput'
            },
            initialize: function () {

            },
            renderDateError: function(error){
            this.dateok=false;
            $('#ErrorModalText').html(error);
            $('#ErrorModal').modal();
            },
            whoinput: function(){
                var beg = $('#mprDateStart').data("DateTimePicker").getDate().valueOf();
                var end = $('#mprDateEnd').data("DateTimePicker").getDate().valueOf();
                $('#whoinputdiv').html('');
                var jqxhr = $.post( "/orgm/mprwhoinput",{"startdate":beg,"enddate":end}, function(res) {
                    console.log(res);
                    var data = JSON.parse(res);
                    var gen='<table class="table table-responsive table-bordered">';
                    data.forEach(function(item){
                       gen+= '<tr><td>'+item.mo+'</td><td>'+item.date+'</td></tr>';
                    });

                    $('#whoinputdiv').html(gen+'</table>');

                }).done(function(){})
                    .fail(function(res) {
                        console.log(res);
                        callback(res);
                    });

            },
            getusers: function(callback){
                $('#moname').select2();
                $.get( "/orgm/getusers", {} )
                    .done(function( data ) {
                        var users = JSON.parse(data);

                    });

            },
            render: function(e){
                monitoring = e.currentTarget.id;
                this.rendermpr();
            },
            rendermpr: function () {
                console.log('rendermpr');

                //var tst = _.flatten(mprSchema,true);
                var _this = this;
                $.get( "/orgm/getusers", {} )
                    .done(function( data ) {
                        var users = JSON.parse(data);


                        $('#adminForm').html(_this.template.mpr({users:users}));
                        $('#mprDateStart').datetimepicker({

                            locale: 'ru'
                        });
                        $('#mprDateEnd').datetimepicker({

                            locale: 'ru'
                        });
                        $('#moname').select2();
                        switch(monitoring){
                            case 'mpr': $('#monitoringName').html("<h4>Введите параметры для Mониторинга преждевременных родов </h4>");break;
                            case 'mprPD':$('#monitoringName').html("<h4>Введите параметры для Mониторинга мероприятий по перенатальной диагностике</h4>"); break;
                        }
                        return this;
                    })
                        .fail(function() {
                            $('#adminForm').html(this.template.mpr({}));
                            $('#mprDateStart').datetimepicker({

                                locale: 'ru'
                            });
                            $('#mprDateEnd').datetimepicker({

                                locale: 'ru'
                            });
                            return this;
                        });


            }
            ,scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            report: function(button){

                var beg = $('#mprDateStart').data("DateTimePicker").getDate().valueOf();
                var end = $('#mprDateEnd').data("DateTimePicker").getDate().valueOf();
                var mo=  $('#moname option:selected').text();
                var type = $(button.currentTarget).attr('id');

                $('#adminForm').html('');
                var data = {beg:beg,end:end,type:type,mo:mo,monitoring:monitoring};
                window.location.replace('/orgm/orgmAdimnReport/' + JSON.stringify(data));


                //window.location.href ="/orgm/orgmAdimnReport?type="+type+"&beg="+beg.valueOf()+"&end="+end.valueOf()+"&mo"+mo;
                return this;
            }

        });
        var mainView = new MainView();

    });

