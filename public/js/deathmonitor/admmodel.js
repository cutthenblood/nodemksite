(function($){


    var admView = Backbone.View.extend({
        el: $('#mainbody'),
        events: {
            'click button#submit': 'getReport'
        },
        initialize: function () {
            var _this=this;
            $('#date').datetimepicker({
                defaultDate: moment().format(),
                locale: 'ru'
            });
        },
        getReport: function(){
            var date = $('#date').data("DateTimePicker").getDate().format("DD.MM.YYYY");
            var rasingsum = $('#rasingsum').prop('checked');
            window.location.href ="/deathmonitor/getReport?date="+date+"&raisingsum="+rasingsum;




// Perform other work here ...

// Set another completion function for the request above





           /*
            $.get( "/deathmonitor/getReport?date="+date, function(data) {
                $('#err').html( '<div class="alert alert-danger">'+data+'</div>');



            });*/
        }


    });
    var admview = new admView();

    })(jQuery)

    /*

    load({'fillform':'../templates/deathmonitor/fillform.ejs'},function(result){
           var moview = new MOView(result);

        $(document.body).append(moview.render().el);

                 });

    */
