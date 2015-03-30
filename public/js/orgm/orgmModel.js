load({
        mprTpl: '/templates/orgm/mprTpl.ejs',
        mprPDTpl: '/templates/orgm/mprPDTpl.ejs'
    },
    function (loaded) {
        var mprModel = Backbone.Model.extend({
            url: '/orgm/mpr/uploadform',
            validate: function (attrs) {
                var errors = [];
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
                if(attrs.rows[0].gr6 != (attrs.rows[0].gr21+attrs.rows[0].gr22+attrs.rows[0].gr23+attrs.rows[0].gr24)){
                    errors.push(['gr21','гр. 6 = гр. 21 + 22 + 23 + 24']);
                    errors.push(['gr22','гр. 6 = гр. 21 + 22 + 23 + 24']);
                    errors.push(['gr23','гр. 6 = гр. 21 + 22 + 23 + 24']);
                    errors.push(['gr24','гр. 6 = гр. 21 + 22 + 23 + 24']);
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
                if(attrs.rows[0].gr6 < (attrs.rows[0].gr33+attrs.rows[0].gr34+attrs.rows[0].gr35)){
                    errors.push(['gr32','гр. 6 ≥ гр. 33 + 34 + 35']);
                    errors.push(['gr33','гр. 6 ≥ гр. 33 + 34 + 35']);
                    errors.push(['gr34','гр. 6 ≥ гр. 33 + 34 + 35']);

                };
                if(attrs.rows[0].gr6 > (attrs.rows[0].gr27+attrs.rows[0].gr28+attrs.rows[0].gr29+attrs.rows[0].gr30+attrs.rows[0].gr31+attrs.rows[0].gr32)){
                    errors.push(['gr27','гр. 6 <= гр. 27 + 28 + 29 + 30 + 31 + 32']);
                    errors.push(['gr28','гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);
                    errors.push(['gr29','гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);
                    errors.push(['gr30','гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);
                    errors.push(['gr31','гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);




                };
                //if(attrs.rows[0].gr7 != ((attrs.rows[0].gr6*100)/attrs.rows[0].gr5)){
                //   errors.push(['gr7','']);
                //};
                if(errors.length>0){
                    return errors;//errors;
                }

            }

        });
        var mprPDModel = Backbone.Model.extend({
            url: '/orgm/mprPD/uploadform',
            validate: function (attrs) {
                var errors = [];
                for (var property in attrs.rows[0]) {
                    if (attrs.rows[0].hasOwnProperty(property)) {
                        if(property.indexOf('gr')>-1){
                            attrs.rows[0][property] = parseInt(attrs.rows[0][property]);
                        }
                    }
                }

              /*  if(attrs.rows[0].gr5 && attrs.rows[0].gr4)
                    if(attrs.rows[0].gr6 != (attrs.rows[0].gr5*100)/attrs.rows[0].gr4){
                        errors.push(['gr6','гр. 6 = (гр. 5 * 100 )/ гр.4 ']);

                    };
                if(attrs.rows[0].gr8 && attrs.rows[0].gr7)
                    if(attrs.rows[0].gr9 != (attrs.rows[0].gr8*100)/attrs.rows[0].gr7){
                        errors.push(['gr9','гр. 9 = (гр. 8 * 100 )/ гр.7 ']);

                    };
                if(attrs.rows[0].gr11 && attrs.rows[0].gr10)
                    if(attrs.rows[0].gr12 != (attrs.rows[0].gr11*100)/attrs.rows[0].gr10){
                        errors.push(['gr12','гр. 12 = (гр. 11 * 100 )/ гр.10 ']);

                    };
                if(attrs.rows[0].gr14 && attrs.rows[0].gr13)
                    if(attrs.rows[0].gr15 != (attrs.rows[0].gr14*100)/attrs.rows[0].gr13){
                        errors.push(['gr15','гр. 15 = (гр. 14 * 100 )/ гр.13 ']);

                    };
*/
                if(attrs.rows[0].gr13 != (attrs.rows[0].gr4+attrs.rows[0].gr7+attrs.rows[0].gr10)){
                    errors.push(['gr13','гр. 13 = гр. 4 + 7 + 10']);
                    errors.push(['gr13','гр. 13 = гр. 4 + 7 + 10']);
                    errors.push(['gr13','гр. 13 = гр. 4 + 7 + 10']);

                };

                if(attrs.rows[0].gr14 != (attrs.rows[0].gr5+attrs.rows[0].gr8+attrs.rows[0].gr11)){
                    errors.push(['gr14','гр. 14 = гр. 5 + 8 + 11']);
                    errors.push(['gr14','гр. 14 = гр. 5 + 8 + 11']);
                    errors.push(['gr14','гр. 14 = гр. 5 + 8 + 11']);

                };


                if(errors.length>0){
                    return errors;//errors;
                }

            }

        });
        var mprmodel = new mprModel();
        var mprPDmodel = new mprPDModel();
        var monitoring = "";
        var MainView = Backbone.View.extend({
            el:$('#mainbody'),

            template: {'mpr':loaded.mprTpl,'mprPDTpl':loaded.mprPDTpl},
            events:{
                'click button#mpr': 'rendermpr',
                'click button#mprPD': 'rendermprPD',
                'click button#ErrorModelClose': 'ErrorModelClose',
                'click button#emptydates': 'EmptyDates',
                'click button#emptyDatesShow': 'EmptyDatesShow'
            },
            initialize: function () {

            },
            EmptyDatesShow: function(e){
                var beg = $('#wiDateStart').data("DateTimePicker").getDate().valueOf();
                var end = $('#wiDateEnd').data("DateTimePicker").getDate().valueOf();
                if(!moment(beg).isValid()) return;
                if(!moment(end).isValid()) return;
                if ((end-beg)<0) return;
                var user = $('#motitle').text().trim().replace('\n','');
                $('#whoinputdiv').html('');
                var jqxhr = $.post( "/orgm/mpremptydates",{"type":monitoring,"startdate":beg,"enddate":end,"username":user}, function(res) {
                    console.log(res);
                    $('#whoinputdiv').html('');
                    var data = JSON.parse(res);
                    var gen='<table class="table table-responsive table-bordered">';
                    data.forEach(function(item){
                        gen+= '<tr><td>'+item.user+'</td><td>'+item.date+'</td></tr>';
                    });

                    $('#whoinputdiv').html(gen+'</table>');

                }).done(function(){})
                    .fail(function(res) {
                        console.log(res);
                        callback(res);
                    });

            },
            EmptyDates: function(error){
                this.dateok=false;
                $('#emptydatesBody').show();

                $('#myModalLabel').html('<h4>Нет данных за</h4>');
                $('button#emptyDatesShow').on('click',this.EmptyDatesShow);
                $('#ErrorModalText').removeClass('alert-danger');
                $('#ErrorModalText').removeClass('alert');
                $('#ErrorModal').modal();
            },
            renderDateError: function(error){
            this.dateok=false;
                $('#emptydatesBody').hide();
                $('#myModalLabel').html('<h4>Ошибка</h4>');
                $('#ErrorModalText').addClass('alert-danger');
                $('#ErrorModalText').addClass('alert');
            $('#ErrorModalText').html(error);
            $('#ErrorModal').modal();
            },
            validateDate: function(date,type){
                if (date == undefined) return;
                var _this= this;
                var now = moment();
                var weekday = now.day();
                var diff = moment().diff(date, 'days');
                var time = moment.duration(moment().diff(date.startOf('day'))).asHours();
                if (time<0) return _this.renderDateError("<h3>Вводить данные за дату в будущем запрещено</h3>");
                //if (weekday == 1 && (time>=9 && time<=12)) {
                var callback = function(res)
                {
                    if (res!="ok")
                        return _this.renderDateError("<h3>Данные за эту дату уже внесены</h3>");
                    else
                    {
                        _this.dateok=true;
                        return;
                    }

                };
                  if(type == 'mpr')      this.postdate(type,date.valueOf(),date.add(1,"days").valueOf(),callback);
                if(type == 'mprPD')      {
                    var start = date.startOf('month');

                    this.postdate(type,start.valueOf(),start.valueOf(),callback);}
                //} else return _this.renderDateError("<h3>Вводить данные разрешено только в понедельник с 9.00 до 12.00</h3>");
            },
            postdate: function(type,startdate,enddate,callback){
                var mo = $('#mo option:selected').text().trim().replace(/ {2,}/g,' ');;
                var jqxhr = $.post( "/orgm/validateDate",{"type":type,"startdate":startdate,"enddate":enddate,"mo":mo}, function(res) {
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
                monitoring= 'mpr';
                //var tst = _.flatten(mprSchema,true);
                $('#report').html(this.template.mpr({users:users,'table':mprSchema}));
                $('.date').datetimepicker({
                    //defaultDate: moment().format(),
                    //pickTime: false,
                    format: 'DD.MM.YYYY',
                    useCurrent: false,
                    locale: 'ru-RU'
                });
                var _this=this;
                this.noreload=false;
                _this.dateok=false;
                $("#date").on("dp.change",function (e) {

                    var dt = $('#date').data("DateTimePicker").date().format("DD.MM.YYYY");
                    _this.validateDate(moment(dt,"DD.MM.YYYY"),'mpr');
                });
                this.validator = $('#mainaddform').
                    bootstrapValidator().on('success.form.bv', function(e) {
                    // Prevent submit form
                    e.preventDefault();

                    var $form     = $('#mainaddform'),
                        validator = $form.data('bootstrapValidator');
                    _this.saveform(validator,validator.getSubmitButton().attr('name'));
                });
                return this;
            },
            rendermprPD:function(){
                console.log('rendermprPD');
                monitoring = 'mprPD';
                $('#report').html(this.template.mprPDTpl({users:users,'table':mprPDSchema}));
                moment.locale('ru');
                $('.date').datetimepicker({


                    viewMode: 'years',
                    format: 'MM/YYYY',
                    locale: 'ru-RU',
                    useCurrent: false

                });
                var _this=this;
                this.noreload=false;
                _this.dateok=false;
                $("#date").on("dp.change",function (e) {

                    var dt = $('#date').data("DateTimePicker").date().format("DD.MM.YYYY");
                    _this.validateDate(moment(dt,"DD.MM.YYYY").startOf('month'),'mprPD');
                });
                this.validator = $('#mainaddform').
                    bootstrapValidator().on('success.form.bv', function(e) {
                        // Prevent submit form
                        e.preventDefault();

                        var $form     = $('#mainaddform'),
                            validator = $form.data('bootstrapValidator');
                        _this.saveformPD(validator,validator.getSubmitButton().attr('name'));
                    });
                return this;
            },
            scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            saveform: function (validator,submittype) {
                validator.resetForm();

                if (this.dateok == false){
                    this.noreload=true;
                    this.renderDateError("<h3>Неправильная дата</h3>");
                    this.scrolltotop();
                    return;
                };
                //var validator = $('#mainaddform').data('bootstrapValidator');
                //var vl = validator.validateField('gr5');
                var arr = [];
		var dfate = moment($('#date').data("DateTimePicker").getDate().valueOf());
                mprmodel.set('inputdate',dfate.format("DD.MM.YYYY"));
                //var dfate = moment($('#date').data("DateTimePicker").getDate().valueOf()).startOf('day');
                //mprmodel.set('inputdate',dfate.valueOf());
                var row={};
                row["username"]=$('#motitle').text().trim().replace('\n','');
                row["mo"]=$('#mo option:selected').text().trim().replace(/ {2,}/g,' ');;
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
                        window.location.href = "/orgm/orgmIndex";
                        $('#report').html('');
                        return this;
                    }
                    else
                    {
                        //mprmodel.save();
                        mprmodel.clear();
                        alert('Ваши данные успешно сохранены!');
                        var form =  $('form');
                        form[0].reset();
                        form.data('bootstrapValidator').resetForm();
                        this.scrolltotop();
                    }
                }
            },
            saveformPD: function (validator,submittype) {
                validator.resetForm();

                if (this.dateok == false){
                    this.noreload=true;
                    this.renderDateError("<h3>Неправильная дата</h3>");
                    this.scrolltotop();
                    return;
                };

                var arr = [];
                var dfate = moment($('#date').data("DateTimePicker").getDate().valueOf()).startOf('month');
                mprPDmodel.set('inputdate',dfate.format("DD.MM.YYYY").valueOf());

                var row={};
                row["username"]=$('#motitle').text().trim().replace('\n','');
                row["mo"]=$('#mo option:selected').text().trim().replace(/ {2,}/g,' ');;
                row['date']=new Date();
                row['date'] =row['date'].valueOf();
                //row['group'] = $('#mo option:selected').val();
                $('form input[type="text"]').each(
                    function (index) {
                        var input = $(this);
                        var gr = input.attr('name');
                        if(gr.indexOf('gr')==-1){
                            return;
                        }
                        row[gr]= parseInt(input.val());

                    });


                mprPDmodel.set("rows",[row]);

                var tt = true;
                if ( !mprPDmodel.isValid()) {
                    this.scrolltotop();//!momodel.isValid()
                    var error = mprPDmodel.validationError;
                    validator.resetForm();
                    error.forEach(function(item){
                        var selector = 'input[name="'+item[0]+'"]'
                        $(selector).val("Ошибка - "+item[1]);
                        validator.updateStatus(item[0], 'INVALID');

                    });
                }
                else
                {

                    mprPDmodel.save();
                    alert('Ваши данные успешно сохранены!');
                    if(submittype=="submitexit"){
                        window.location.href = "/orgm/orgmIndex";
                        $('#report').html('');
                        return this;
                    }
                    else
                    {

                        mprPDmodel.clear();
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

