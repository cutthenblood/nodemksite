(function($){

    var MOmodel = Backbone.Model.extend({
        url: '/deathmonitor/uploadform',
        validate: function (attrs) {
            var errors = [];
            if(attrs.rows[0].gr29 < attrs.rows[0].gr30){
                errors.push('gr29','gr30');
            }
            if(attrs.rows[0].gr17 < attrs.rows[0].gr18){
                errors.push('gr17','gr18');
            }
            if(attrs.rows[0].gr22 < (attrs.rows[0].gr23+attrs.rows[0].gr24+attrs.rows[0].gr25)){
                errors.push('gr22','gr23','gr24','gr25');
            }
            if(attrs.rows[0].gr10 < (attrs.rows[0].gr11+attrs.rows[0].gr12+attrs.rows[0].gr13)){
                errors.push('gr10','gr11','gr12','gr13');
            }
            if(attrs.rows[0].gr6 < (attrs.rows[0].gr8+attrs.rows[0].gr9+attrs.rows[0].gr10+attrs.rows[0].gr14+attrs.rows[0].gr15+attrs.rows[0].gr16+attrs.rows[0].gr17+attrs.rows[0].gr19)){
                errors.push('gr6','gr8','gr9','gr10','gr14','gr15','gr16','gr17','gr19');
            }
            if(attrs.rows[0].gr7 < (attrs.rows[0].gr20+attrs.rows[0].gr21+attrs.rows[0].gr22+attrs.rows[0].gr26+attrs.rows[0].gr27+attrs.rows[0].gr28+attrs.rows[0].gr29+attrs.rows[0].gr31)){
                errors.push('gr7','gr20','gr21','gr22','gr26','gr27','gr28','gr29','gr31');
            }
            if((attrs.rows[0].gr3+attrs.rows[0].gr4+attrs.rows[0].gr5)!= (attrs.rows[0].gr6+attrs.rows[0].gr7)){
                errors.push('gr3','gr4','gr5','gr6','gr7');
            }
            if(attrs.rows[0].gr2 != (attrs.rows[0].gr3+attrs.rows[0].gr4+attrs.rows[0].gr5)){
                errors.push('gr2','gr3','gr4','gr5');
            }
            if(errors.length>0){
                return errors;//errors;
            }
        }

    });

    var momodel = new MOmodel();
    var MOView = Backbone.View.extend({
        el: $('#mainbody'),
        initialize: function () {
            var _this=this;
            $('#date').datetimepicker({
                defaultDate: moment().format(),
                language: 'ru'
            });
            $("#bskdate").html("Кол-во умерших от БСК всего за  <b>"+$('#date').data("DateTimePicker").getDate().format("DD.MM.YYYY")+"</b>");

            $("#date").on("dp.change",function (e) {
                var dt = $('#date').data("DateTimePicker").getDate().format("DD.MM.YYYY");
                $("#bskdate").html("Кол-во умерших от БСК всего за  <b>"+$('#date').data("DateTimePicker").getDate().format("DD.MM.YYYY")+"</b>");
            });

            $('form').bootstrapValidator({

                submitHandler: function(validator, form, submitButton) {
                    _this.saveform(submitButton.attr('name'));

                }
            });
        },
        scrolltotop: function(){
            $("html, body").animate({ scrollTop: 0 }, "slow");
        },
        saveform: function (submittype) {
            var arr = [];
            momodel.set('inputdate',$('#date').data("DateTimePicker").getDate().format("DD.MM.YYYY"));
            var row={};
            row["username"]=$('#moname').text();
            row['date']=new Date();
            $('form input[type="text"]').each(
                function (index) {
                    var input = $(this);
                    var gr = input.attr('name');
                    if(gr.indexOf('gr')==-1){
                        return;
                    }
                    row[gr]= parseInt(input.val());

                });
            momodel.set("rows",[row]);

            var tt = true;
            if ( !momodel.isValid()) {//!momodel.isValid()
                var error = momodel.validationError;
                error.forEach(function(item){
                    var selector = 'input[name="'+item+'"]'
                    $(selector).val("Ошибка");

                    $('form')
                        // Get the bootstrapValidator instance
                        .data('bootstrapValidator')
                        // Mark the field as not validated, so it'll be re-validated when the user change date
                        .updateStatus(item, 'NOT_VALIDATED ', null)
                    // Validate the field
                    .validateField(item);
                });
                this.scrolltotop();

            }
            else
            {
                momodel.save();
                alert('Ваши данные успешно сохранены!');
                if(submittype=="submitexit"){
                    window.location.href = "/deathmonitor";
                }
                else
                {
                    var form =  $('form');
                    form[0].reset();
                    form.data('bootstrapValidator').resetForm();
                    this.scrolltotop();
                }
            }



        }
    });
    var moview = new MOView();

    })(jQuery)

    /*

    load({'fillform':'../templates/deathmonitor/fillform.ejs'},function(result){
           var moview = new MOView(result);

        $(document.body).append(moview.render().el);

                 });

    */
