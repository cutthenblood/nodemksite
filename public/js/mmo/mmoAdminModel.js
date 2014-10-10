load({
        ofosvkrTpl: '/templates/mmo/mmoOfosvkrAdminTpl.ejs'
    },
    function (loaded) {

        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'ofosvkr':loaded.ofosvkrTpl},
            events:{
                'click button#ofosvkr': 'renderofosvkr',
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
            renderofosvkr: function () {
                console.log('renderofosvkr');
                //var tst = _.flatten(mprSchema,true);
                $('#adminForm').html(this.template.ofosvkr({}));
                $('#ofosvkrDateStart').datetimepicker({
                    pickTime: false,
                    language: 'ru'
                });

                return this;
            }
            ,scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            report: function(button){

                var beg = $('#ofosvkrDateStart').data("DateTimePicker").getDate().valueOf();

                var type = $(button.currentTarget).attr('id');
                $('#adminForm').html('');
                window.location.href ="/mmo/mmoAdminReport?type="+type+"&beg="+beg.valueOf();
                return this;
            }

        });
        var mainView = new MainView();

    });

