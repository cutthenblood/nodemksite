load({
        mprTpl: '/templates/orgm/orgmMprAdminTpl.ejs'
    },
    function (loaded) {

        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'mpr':loaded.mprTpl},
            events:{
                'click button#mpr': 'rendermpr',
                'click button#ErrorModelClose': 'ErrorModelClose',
                'click [name=submitBtn]': 'report'
            },
            initialize: function () {

            },
            renderDateError: function(error){
            this.dateok=false;
            $('#ErrorModalText').html(error);
            $('#ErrorModal').modal();
            },
            rendermpr: function () {
                console.log('rendermpr');
                //var tst = _.flatten(mprSchema,true);
                $('#adminForm').html(this.template.mpr({}));
                $('#mprDateStart').datetimepicker({
                    pickTime: false,
                    language: 'ru'
                });
                $('#mprDateEnd').datetimepicker({
                    pickTime: false,
                    language: 'ru'
                });
                return this;
            }
            ,scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            report: function(button){

                var beg = $('#mprDateStart').data("DateTimePicker").getDate().valueOf();
                var end = $('#mprDateEnd').data("DateTimePicker").getDate().valueOf();
                var type = $(button.currentTarget).attr('id');
                $('#adminForm').html('');
                window.location.href ="/orgm/orgmAdimnReport?type="+type+"&beg="+beg.valueOf()+"&end="+end.valueOf();
                return this;
            }

        });
        var mainView = new MainView();

    });

