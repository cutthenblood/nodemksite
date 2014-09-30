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
                $('form').bootstrapValidator({

                    submitHandler: function(validator, form, submitButton) {
                        _this.saveform(submitButton.attr('name'));

                    }
                });
            },
            renderDateError: function(error){
                $('#ErrorModalText').html(error);
                $('#ErrorModal').modal();
            },
            scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            renderofosvkr: function () {
                console.log('renderofosvkr');
                $(this.el).html(this.template.ofosvkr({'table':ofosvkrSchema}));
                $('.date').datetimepicker({
                    //defaultDate: moment().format(),
                    pickTime: false,
                    language: 'ru'
                });
                return this;
            }
        });
        var mainView = new MainView();

    });

