load({
        mprTpl: '/templates/orgm/mprTpl.ejs'
    },
    function (loaded) {
        var mprModel = Backbone.Model.extend({
            url: '/orgm/mpr/uploadform',
            validate: function (attrs) {
/*                var errors = [];
                for (var property in attrs.rows[0]) {
                    if (attrs.rows[0].hasOwnProperty(property)) {
                        if(property.indexOf('gr')>-1){
                            attrs.rows[0][property] = parseInt(attrs.rows[0][property]);
                        }
                    }
                }

                if(attrs.rows[0].gr5 < attrs.rows[0].gr6){
                    errors.push(['gr5','гр. 5 ≥ гр. 6']);
                };
                if(attrs.rows[0].gr6 < attrs.rows[0].gr8){
                    errors.push(['gr8','гр. 6 ≥ гр. 8']);
                };
                if(attrs.rows[0].gr6 < attrs.rows[0].gr9){
                    errors.push(['gr9','гр. 6 ≥ гр. 9']);
                };
                if(attrs.rows[0].gr6 < attrs.rows[0].gr10){
                    errors.push(['gr10','6 ≥ гр. 10']);
                };
                if(attrs.rows[0].gr6 < attrs.rows[0].gr11){
                    errors.push(['gr11','гр. 6 ≥ гр. 11']);
                };
                if(attrs.rows[0].gr6 < attrs.rows[0].gr12){
                    errors.push(['gr12','гр. 6 ≥ гр. 12']);
                };
                if(attrs.rows[0].gr6 < attrs.rows[0].gr13){
                    errors.push(['gr13','гр. 6 ≥ гр. 13']);
                };
                if(attrs.rows[0].gr6 != (attrs.rows[0].gr10+attrs.rows[0].gr11+attrs.rows[0].gr12+attrs.rows[0].gr13)){
                    errors.push(['gr10','гр. 6 = гр. 10 + 11 + 12 + 13']);
                    errors.push(['gr11','гр. 6 = гр. 10 + 11 + 12 + 13']);
                    errors.push(['gr12','гр. 6 = гр. 10 + 11 + 12 + 13']);
                    errors.push(['gr13','гр. 6 = гр. 10 + 11 + 12 + 13']);
                };
                if(attrs.rows[0].gr6 != (attrs.rows[0].gr14+attrs.rows[0].gr15+attrs.rows[0].gr16+attrs.rows[0].gr17+attrs.rows[0].gr18+attrs.rows[0].gr19+attrs.rows[0].gr20)){
                    errors.push(['gr14','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr15','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr16','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr17','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr18','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr19','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    errors.push(['gr20','гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                };
                if(attrs.rows[0].gr6 != (attrs.rows[0].gr25+attrs.rows[0].gr26)){
                    errors.push(['gr25',' гр. 6 = гр. 25 + 26']);
                    errors.push(['gr26',' гр. 6 = гр. 25 + 26']);
                };
                if(attrs.rows[0].gr6 < (attrs.rows[0].gr32+attrs.rows[0].gr33+attrs.rows[0].gr34)){
                    errors.push(['gr32','гр. 6 ≥ гр. 32 + 33 + 34']);
                    errors.push(['gr33','гр. 6 ≥ гр. 32 + 33 + 34']);
                    errors.push(['gr34','гр. 6 ≥ гр. 32 + 33 + 34']);

                };
                if(attrs.rows[0].gr7 != ((attrs.rows[0].gr6*100)/attrs.rows[0].gr5)){
                    errors.push(['gr7','']);
                };
                if(errors.length>0){
                    return errors;//errors;
                }*/
            }

        });
        var mprmodel = new mprModel();
        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'mpr':loaded.mprTpl},
            events:{
                'click button#mpr': 'rendermpr',
                'click button#ErrorModelClose': 'ErrorModelClose'
            },
            initialize: function () {

            },
            renderDateError: function(error){
            this.dateok=false;
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
                var jqxhr = $.post( "/orgm/validateDate",{"startdate":startdate,"enddate":enddate,"username":username}, function(res) {
                    console.log(res);
                    callback(res);
                }).done(function(){})
                    .fail(function(res) {
                        console.log(res);
                        callback(res);
                    });
            },
            rendermpr: function () {
                console.log('rendermpr');
                //var tst = _.flatten(mprSchema,true);
                $('#report').html(this.template.mpr({users:users,'table':mprSchema}));
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
                this.validator = $('#mainaddform').bootstrapValidator({

                    submitHandler: function(validator, form, submitButton) {
                        _this.saveform(validator,submitButton.attr('name'));

                    }
                },true);
                return this;
            }
            ,scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            saveform: function (validator,submittype) {
                validator.resetForm();
                var vl = validator.validate();
                if(!validator.isValid()){
                    console.log('form invalid');
                    this.noreload=true;
                    this.renderDateError("<h3>Ошибка в звполнении полей</h3>");
                    this.scrolltotop();
                    return;


                };
                if (this.dateok == false){
                    this.noreload=true;
                    this.renderDateError("<h3>Неправильная дата</h3>");
                    this.scrolltotop();
                    return;
                };
                //var validator = $('#mainaddform').data('bootstrapValidator');
                //var vl = validator.validateField('gr5');
                var arr = [];
                mprmodel.set('inputdate',$('#date').data("DateTimePicker").getDate().valueOf());
                var row={};
                row["username"]=$('#motitle').text().trim().replace('\n','');
                row["mo"]=$('#mo option:selected').text().trim();
                row['date']=new Date();
                row['date'] =row['date'].valueOf();
                row['group'] = $('#mo option:selected').val();
                $('form input[type="text"]').each(
                    function (index) {
                        var input = $(this);
                        var gr = input.attr('name');
                        if(gr.indexOf('gr')==-1){
                            return;
                        }
                        row[gr]= parseInt(input.val());

                    });

                row['gr7'] =  (parseInt(row.gr6)*100)/parseInt(row.gr5);
                mprmodel.set("rows",[row]);

                var tt = true;
                if ( !mprmodel.isValid()) {
                    this.scrolltotop();//!momodel.isValid()
                    var error = mprmodel.validationError;
                    validator.resetForm();
                    error.forEach(function(item){
                        var selector = 'input[name="'+item[0]+'"]'
                        $(selector).val("Ошибка - "+item[1]);
                         validator.updateStatus(item[0], 'INVALID');
                                  //.validateField(item);
                    });


                }
                else
                {

                    mprmodel.save();
                    alert('Ваши данные успешно сохранены!');
                    if(submittype=="submitexit"){
                        //window.location.href = "/orgm/orgmIndex";
                        $('#report').html('');
                        return this;
                    }
                    else
                    {
                        mprmodel.save();
                        alert('Ваши данные успешно сохранены!');
                        var form =  $('form');
                        form[0].reset();
                        form.data('bootstrapValidator').resetForm();
                        this.scrolltotop();
                    }
                }
            }
        });
        var mainView = new MainView();

    });
