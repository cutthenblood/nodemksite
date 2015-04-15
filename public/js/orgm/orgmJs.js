load({
        mprTpl: '/templates/orgm/mprTpl.ejs',
        mprPDTpl: '/templates/orgm/mprPDTpl.ejs',
        deathmTpl: '/templates/orgm/deathmTpl.ejs',
        mainTpl: '/templates/orgm/mainTpl.ejs',
        checkTpl: '/templates/orgm/checkTpl.ejs',
        checkResultTpl: '/templates/orgm/checkResultTpl.ejs',
        loginTpl: '/templates/login.ejs',
        adminTpl: '/templates/orgm/adminTpl.ejs',
    },
    function (loaded) {
        var types=['mpr','mprPD','deathm'];
        var flattenSchema = function(schema,result){
            schema.forEach(function(itm){
                result[itm.name]=itm.label;
                if('sub' in itm)
                    flattenSchema(itm.sub,result);
            })
        };
        var checkLoggedIn =  function () {
            return new vow.Promise(function (resolve, reject, notify) {
                $.get('/orgm/isLoggendIn', function (data) {
                    resolve(data);
                });
            });}
        function convertSchema(schema,result,columns){
            var _this = this;
            var tr = [];
            schema.forEach(function(itm){
                var td ={};
                if(itm.type=="info") return;
                if(itm.type!='subgraphs')
                    columns.push(parseInt(itm.name.slice(2)));
                if('rowspan' in itm)
                    td.rowspan=itm.rowspan;
                if('colspan' in itm)
                    td.colspan=itm.colspan;
                td.val = itm.label;
                tr.push(td);
            });
            result.push(tr);
            var subs=[];
            schema.map(function(itm){
                if('sub' in itm)
                    subs = subs.concat(itm.sub);
            });
            if(subs.length>0)
                convertSchema(subs,result,columns);
            else {

                return result;
            }
        }
        function Utility (data){
                if(data.mo && data.mo.length>1)
                    this.mo = data.mo;
                if(data.username && data.mo.length>1)
                    this.username = data.username;
                if(data.start)
                    this.start = data.start;
                if(data.end)
                    this.end = data.end;
                if(data.type && data.type.length>1)
                    this.type = data.type;
                if(data.schema)
                    this.schema = data.schema;
                if(data.inputdate)
                    this.inputdate = data.inputdate;

            this._switch = function(callbacks){
                return callbacks[this.type];
            };
            this.save_fn = function (){
                var _this = this;
                 var callbacks = {
                    'mpr': function(){
                        return _this.inputdate.startOf('day').valueOf();
                        },

                    'mprPD': function(){
                        return _this.inputdate.startOf('month').valueOf();
                    },

                    'deathm': function(){
                        return _this.inputdate.startOf('day').valueOf();
                        }
                };
                return this._switch(callbacks)();
            };
            this.whoinput = function(){
                var _this = this;
                var callbacks = {
                    'mpr': function(){
                        var data = {};
                        data.type = _this.type;
                        data.start = _this.start.startOf('day').valueOf();
                        data.end = _this.end.startOf('day').valueOf();
                        data.mo=_this.mo;
                        return data;
                    },

                    'mprPD': function(){
                        var data = {};
                        data.type = _this.type;
                        data.start = _this.start.startOf('month').valueOf();
                        data.end = _this.end.startOf('month').valueOf();
                        data.mo=_this.mo;
                        return data;
                    },

                    'deathm': function(){
                        var data = {};
                        data.type = _this.type;
                        data.start = _this.start.startOf('day').valueOf();
                        data.end = _this.end.startOf('day').valueOf();
                        data.username = _this.username;
                        return data;
                    }
                };
                return this._switch(callbacks)();
            };
            this.schema = function (mapping,columns,func){
         
                var callbacks = {
                    'mpr': function(){
                        func(mprSchema,mapping,columns);
                        return mprSchema[0];
                    },

                    'mprPD': function(){
                        func(mprPDSchema,mapping,columns);
                        return mprPDSchema[0];
                    },

                    'deathm': function(){
                        func(deathmSchema,mapping,columns);
                        return deathmSchema[0];
                    }
                };
                return this._switch(callbacks)();
            };
            this.getReport = function (oneMO){
                var _this = this;
                var callbacks = {
                    'mpr': function(){
                        var data = {};
                        data.type = _this.type;
                        if(oneMO)
                            data.type = 'mprone'
                        data.start = _this.start.startOf('day').valueOf();
                        data.end = _this.end.startOf('day').valueOf();
                        data.mo=_this.mo;
                        return data;
                    },

                    'mprPD': function(){
                        var data = {};
                        data.type = _this.type;
                        data.start = _this.start.startOf('month').valueOf();
                        data.end = _this.end.startOf('month').valueOf();
                        data.mo=_this.mo;
                        return data;
                    },

                    'deathm': function(){
                        var data = {};
                        data.type = _this.type;
                        data.start = _this.start.startOf('day').valueOf();

                        return data;
                    }
                };
                return this._switch(callbacks)();
            };
            //this._this = this;
            //return this;
        };
        var Router = Backbone.Router.extend({
            routes: {
                "":             "main",
                "main":         "main",
                "mpr":          "mpr",
                "mprPD":        "mprPD",
                "check":        "check",
                "deathm":        "deathm",
                "admin":        "admin",
                '*notFound':    'notFound'
            },
            notFound: function(){
                window.location = '/orgmMM';
            },
            admin: function(){
                console.log('admin');
                checkLoggedIn().then(function(user){
                    console.log(user);
                    if(user=='0')
                        mainView.renderLogin('');
                    else if(user.role=='admin')
                    {mainView.setUser(user);
                        mainView.renderAdminForm();}
                })
            },
            main: function() {
                console.log('main');
                checkLoggedIn().then(function(user){
                    console.log(user);
                    if(user=='0')
                        mainView.renderLogin('');
                    else
                    {mainView.setUser(user);mainView.renderMain();}
                })
            },
            mpr: function() {
                console.log('mpr route');
                orgmmodel.setModel('mpr');

                checkLoggedIn().then(function(user){
                    console.log(user);
                    if(user=='0')
                        mainView.renderLogin('');
                    else
                    {mainView.setUser(user);mainView.renderMpr();}
                })

            },
            mprPD: function() {
                console.log('mprPD route');
                orgmmodel.setModel('mprPD');
                var _this = this;
                checkLoggedIn().then(function(user){
                    console.log(user);
                    if(user=='0')
                        mainView.renderLogin('');
                    else
                    {mainView.setUser(user);mainView.renderMprPD();}
                });
            },
            deathm: function() {
                console.log('deathm route');
                orgmmodel.setModel('deathm');
                checkLoggedIn().then(function(user){
                    console.log(user);
                    if(user=='0')
                        mainView.renderLogin('');
                    else
                    {mainView.setUser(user);mainView.renderdeathm();}
                })

            },
            check: function() {
                console.log('check route');
                //orgmmodel.setModel('mprPD');
                var _this = this;

                checkLoggedIn().then(function(user){
                    console.log(user);
                    if(user=='0')
                        mainView.renderLogin('');
                    else
                    {mainView.setUser(user);mainView.renderCheck();}
                });
            }

        });
        var Model = Backbone.Model.extend({
            url: '/orgm/save',
            setModel: function(name){
                this._model = name;
            },
            validate: function (attrs) {
                var errors = [];
                for (var property in attrs.rows[0]) {
                    if (attrs.rows[0].hasOwnProperty(property)) {
                        if(property.indexOf('gr')>-1){
                            attrs.rows[0][property] = parseInt(attrs.rows[0][property]);
                        }
                    }
                }
                if(this._model =='mpr') {
                    if (attrs.rows[0].gr5 < attrs.rows[0].gr6) {
                        errors.push(['gr5', 'гр. 5 ≥ гр. 6']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < attrs.rows[0].gr8) {
                        errors.push(['gr8', 'гр. 6 ≥ гр. 8']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < attrs.rows[0].gr9) {
                        errors.push(['gr9', 'гр. 6 ≥ гр. 9']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < attrs.rows[0].gr10) {
                        errors.push(['gr10', '6 ≥ гр. 10']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < attrs.rows[0].gr11) {
                        errors.push(['gr11', 'гр. 6 ≥ гр. 11']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < attrs.rows[0].gr12) {
                        errors.push(['gr12', 'гр. 6 ≥ гр. 12']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < attrs.rows[0].gr13) {
                        errors.push(['gr13', 'гр. 6 ≥ гр. 13']);
                    }
                    ;
                    if (attrs.rows[0].gr6 != (attrs.rows[0].gr10 + attrs.rows[0].gr11 + attrs.rows[0].gr12 + attrs.rows[0].gr13)) {
                        errors.push(['gr10', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                        errors.push(['gr11', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                        errors.push(['gr12', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                        errors.push(['gr13', 'гр. 6 = гр. 10 + 11 + 12 + 13']);
                    }
                    ;
                    if (attrs.rows[0].gr6 != (attrs.rows[0].gr21 + attrs.rows[0].gr22 + attrs.rows[0].gr23 + attrs.rows[0].gr24)) {
                        errors.push(['gr21', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                        errors.push(['gr22', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                        errors.push(['gr23', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                        errors.push(['gr24', 'гр. 6 = гр. 21 + 22 + 23 + 24']);
                    }
                    ;
                    if (attrs.rows[0].gr6 != (attrs.rows[0].gr14 + attrs.rows[0].gr15 + attrs.rows[0].gr16 + attrs.rows[0].gr17 + attrs.rows[0].gr18 + attrs.rows[0].gr19 + attrs.rows[0].gr20)) {
                        errors.push(['gr14', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                        errors.push(['gr15', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                        errors.push(['gr16', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                        errors.push(['gr17', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                        errors.push(['gr18', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                        errors.push(['gr19', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                        errors.push(['gr20', 'гр. 6 = гр. 14 + 15 + 16 + 17 + 18 + 19 + 20']);
                    }
                    ;
                    if (attrs.rows[0].gr6 != (attrs.rows[0].gr25 + attrs.rows[0].gr26)) {
                        errors.push(['gr25', ' гр. 6 = гр. 25 + 26']);
                        errors.push(['gr26', ' гр. 6 = гр. 25 + 26']);
                    }
                    ;
                    if (attrs.rows[0].gr6 < (attrs.rows[0].gr33 + attrs.rows[0].gr34 + attrs.rows[0].gr35)) {
                        errors.push(['gr32', 'гр. 6 ≥ гр. 33 + 34 + 35']);
                        errors.push(['gr33', 'гр. 6 ≥ гр. 33 + 34 + 35']);
                        errors.push(['gr34', 'гр. 6 ≥ гр. 33 + 34 + 35']);

                    }
                    ;
                    if (attrs.rows[0].gr6 > (attrs.rows[0].gr27 + attrs.rows[0].gr28 + attrs.rows[0].gr29 + attrs.rows[0].gr30 + attrs.rows[0].gr31 + attrs.rows[0].gr32)) {
                        errors.push(['gr27', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31 + 32']);
                        errors.push(['gr28', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);
                        errors.push(['gr29', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);
                        errors.push(['gr30', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);
                        errors.push(['gr31', 'гр. 6 <= гр. 27 + 28 + 29 + 30 + 31+ 32']);

                    }
                    ;
                }
                else if(this._model == 'mprPD'){
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
                }
                else if(this._model == 'deathm'){
                    if(attrs.rows[0].gr29 < attrs.rows[0].gr30){
                        errors.push(['gr29','гр. 29 >= гр. 30']);
                    }
                    if(attrs.rows[0].gr17 < attrs.rows[0].gr18){
                        errors.push(['gr17','гр. 17 >= гр. 18']);
                    }
                    if(attrs.rows[0].gr22 < (attrs.rows[0].gr23+attrs.rows[0].gr24+attrs.rows[0].gr25)){
                        errors.push(['gr22','гр. 22 >= гр. 23 + 24 + 25 ']);
                    }
                    if(attrs.rows[0].gr10 < (attrs.rows[0].gr11+attrs.rows[0].gr12+attrs.rows[0].gr13)){
                        errors.push(['gr10','гр. 10 >= гр. 11 + 12 + 13 ']);
                    }
                    if(attrs.rows[0].gr6 < (attrs.rows[0].gr8+attrs.rows[0].gr9+attrs.rows[0].gr10+attrs.rows[0].gr14
                        +attrs.rows[0].gr15+attrs.rows[0].gr16+attrs.rows[0].gr17+attrs.rows[0].gr19)){
                        errors.push(['gr6','гр. 6 >= гр. 8 + 9 + 10 + 14 + 15 + 16 + 17 + 19 ']);
                    }
                    if(attrs.rows[0].gr7 < (attrs.rows[0].gr20+attrs.rows[0].gr21+attrs.rows[0].gr22+attrs.rows[0].gr26
                        +attrs.rows[0].gr27+attrs.rows[0].gr28+attrs.rows[0].gr29+attrs.rows[0].gr31)){
                        errors.push(['gr7','гр. 7 >= гр. 20 + 21 + 22 + 26 + 27 + 28 + 29 + 31 ']);
                    }
                    if((attrs.rows[0].gr3+attrs.rows[0].gr4+attrs.rows[0].gr5)!= (attrs.rows[0].gr6+attrs.rows[0].gr7)){
                        errors.push(['gr3','гр. 3 + 4 + 5 == гр. 6 + 7']);
                    }
                    if(attrs.rows[0].gr2 != (attrs.rows[0].gr3+attrs.rows[0].gr4+attrs.rows[0].gr5)){
                        errors.push('gr2','гр. 2 == гр. 3 + 4 + 5 ');
                    }
                }

                if(errors.length>0){
                    return errors;//errors;
                }

            }
        });
        var orgmmodel = new Model();
        var MainView = Backbone.View.extend({
            el:$('#mainbody'),
            template: {'login':loaded.loginTpl,'adminTpl':loaded.adminTpl,'checkResultTpl':loaded.checkResultTpl,
                'checkTpl':loaded.checkTpl,'main':loaded.mainTpl,'deathmTpl':loaded.deathmTpl,
                'mprTpl':loaded.mprTpl,'mprPDTpl':loaded.mprPDTpl},
            events: {
                'click button#loginButton': 'loggingIn',
                'change select#monitoring': 'monitChange',
                'click button.report':      'getReport',
                'click button.whoinput':      'renderwhoinput'


            },
            initialize: function () {

                var _this=this;
                if(["main",""].indexOf(Backbone.history.location.hash)<0)
                    checkLoggedIn().then(function(user) {
                        console.log(user);
                        if (user == '0')
                            _this.renderLogin('');
                        else if (user.role == 'admin')
                            _this.renderAdminForm('check');
                        else {
                            _this.setUser(user);
                            _this.renderMain();
                        }
                    })
            },
            scrolltotop: function(){
                $("html, body").animate({ scrollTop: 0 }, "slow");
            },
            monitChange: function(e){
                if(e.currentTarget.value=='mpr'){
                    $('.date').each(function(dt) {
                        $(this).data("DateTimePicker").options({
                            format: 'DD.MM.YYYY',
                            useCurrent: false,
                            locale: 'ru-RU'
                        });
                    });
                    if(this._user.role=='admin'){

                        var options ='';
                        this.users.forEach(function(user){
                            if(user.mo)
                                user.mo.forEach(function (mo) {
                                options += '<option>' + mo.fullname + '</option>'
                            });
                        })

                        $('#mo').html(options);

                        $('.dmdis').removeAttr('disabled','disabled');

                    } else {

                        $('#mo').html(this._user.mo.reduce(function (prev, next) {
                            return prev + '<option>' + next.fullname + '</option>'
                        }, ''));
                        $('#mo').removeAttr('disabled');
                    }
                }
                else if(e.currentTarget.value=='mprPD'){
                    $('.date').each(function(dt) {
                            $(this).data("DateTimePicker").options({
                            viewMode: 'years',
                            format: 'MM/YYYY',
                            locale: 'ru-RU',
                            useCurrent: false
                        })
                    });

                    if(this._user.role=='admin'){
                        this.users.forEach(function(user){
                            if(user.uz){
                                options += '<option>' + user.uz + '</option>'
                            } else
                                if(user.mo)
                                    user.mo.forEach(function (mo) {
                                        options += '<option>' + mo.fullname + '</option>'
                                    });
                        })
                        $('#mo').html(options);


                        $('.dmdis').removeAttr('disabled','disabled');
                        $('.mpdis').attr('disabled','disabled');
                    } else {

                        if(this._user.uz)
                            $('#mo').html('<option>'+this._user.uz+'</option>');
                        else
                            $('#mo').html(this._user.mo.reduce(function(prev,next){
                                return prev +'<option>'+next.fullname+'</option>'
                            },''));
                        $('#mo').removeAttr('disabled');
                    }
                }
                else if(e.currentTarget.value == 'deathm'){
                    $('.date').each(function(dt) {
                        $(this).data("DateTimePicker").options({
                            format: 'DD.MM.YYYY',
                            useCurrent: false,
                            locale: 'ru-RU'
                        })
                    });
                    if(this._user.role=='admin'){

                        $('.dmdis').attr('disabled','disabled');
                    } else
                    $('#mo').attr('disabled','disabled');
                }

            },
            loggingIn: function(){
              console.log('loggingIn');
                var _this= this;
              this.post('orgm/authMM',{'username':$('#userlist').val(),'password':$('input[name=password]').val()},function(err,user){
                  if(err){
                      _this.renderLogin('Ошибка авторизации');
                  }
                  else
                  {_this.setUser(user);
                      if(user.role=='admin')
                        router.navigate('admin',{trigger:true});
                      else
                        router.navigate('main',{trigger:true});
                      window.location.reload();}
              });

            },
            submitHeandler: function(id){
                var _this = this;
                $(id).validator().on('submit', function (e) {
                    e.preventDefault();
                    _this.save();
                    //_this.saveform(validator,validator.getSubmitButton().attr('name'));
                })
            },
            setUser: function(user){
                this._user=user;
            },
            post: function(url,data,callback){
                $.post(url,data, function(res) {
                    //console.log(res);
                    callback(null,res);
                }).done(function(){})
                .fail(function(res) {
                    console.log(res);
                    callback(res,null);
                });
            },
            validateDate: function(type,date,mo){
                var _this= this;

                this.post('orgm/checkDate',{'type':type,'date':date,'mo':mo},function(err,res){
                    if(err){
                        _this.renderLogin('Ошибка авторизации');
                    }
                    else
                        if(res=="1"){
                            $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка за эту дату данные уже внесены!!</div>');
                            $('#date').data("DateTimePicker").date(null);
                            this.scrolltotop();
                        }
                });

            },
            renderMain: function(){

                $('#mainbody').html(this.template.main({name:this._user.username}));
                $(".nav a").on("click", function(){
                    $(".nav").find(".active").removeClass("active");
                    $(this).parent().addClass("active");
                });


            },
            renderLogin: function(message){
                var _this = this;
                var render = function render(users,message){
                    $('#mainbody').html(_this.template.login({users:users,message: message,action:'/orgm/authMM' }));
                };
                if(this.users){
                    render(this.users,message)
                } else {
                    this.post('orgm/users',{},function(err,data){
                        if(err){
                            $('#mainbody').html('<div><h3>Ошибка - '+err.status+'  '+err.statusText +'</h3></div>');
                        } else {
                            var users = JSON.parse(data);
                            _this.users = users;
                            render(users,message);
                        }
                    })
                }
            },
            renderMpr: function(){
                var _this = this;
                console.log('renderMpr');
                $('#report').html(this.template.mprTpl({user:this._user,'table':mprSchema}));
                $('.date').datetimepicker({
                    format: 'DD.MM.YYYY',
                    useCurrent: false,
                    locale: 'ru-RU',
                    showTodayButton:true

                });
                $("#date").on("dp.change",function (e) {
                    _this.validateDate('mpr',
                        $('#date').data("DateTimePicker").date().startOf('day').valueOf(),
                         $('#mo option:selected').text().trim().replace(/ {2,}/g,' '));
                });
                this.submitHeandler('#mainaddform');
            },
            renderMprPD: function(){
                var _this = this;
                console.log('renderMprPD');
                $('#report').html(this.template.mprPDTpl({user:this._user,'table':mprPDSchema}));
                $('.date').datetimepicker({
                    viewMode: 'years',
                    format: 'MM/YYYY',
                    locale: 'ru-RU',
                    useCurrent: false
                });
                this.submitHeandler('#mainaddform');
            },
            renderdeathm: function(){
                var _this = this;
                console.log('renderdeathm');
                $('#report').html(this.template.deathmTpl({'table':deathmSchema}));
                $('.date').datetimepicker({
                    format: 'DD.MM.YYYY',
                    useCurrent: false,
                    locale: 'ru-RU'
                });
                this.submitHeandler('#mainaddform');

            },
            save: function(){
                $('#alert').html('');
                var dt = $('#date').data("DateTimePicker").date();
                if(!dt || !dt.isValid()){
                    $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка в дате</div>');
                   this.scrolltotop();
                } else {
                    $('#alert').html('');
                    var dfate = 'err';
                    var util = new Utility({inputdate:dt,type:orgmmodel._model});

                    orgmmodel.set('inputdate',util.save_fn());
                    orgmmodel.set('type',orgmmodel._model);
                    var row={};
                    row["username"]=this._user.username;
                    row["mo"]=$('#mo option:selected').text().trim().replace(/ {2,}/g,' ');
                    row['date']=new Date();
                    row['date'] =row['date'].valueOf();
                    $('form input[type="text"]').each(
                        function (index) {
                            var input = $(this);
                            var gr = input.attr('name');
                            if(gr.indexOf('gr')==-1){
                                return;
                            }
                            row[gr]= parseInt(input.val());

                        });
                    orgmmodel.set("rows",[row]);
                    if ( !orgmmodel.isValid()) {
                        console.log('not valid');
                        orgmmodel.validationError.forEach(function(item){
                            var selector = 'input[name="'+item[0]+'"]'
                            $(selector).val("Ошибка - "+item[1]);
                        });
                        $('#mainaddform').validator('validate')
                        this.scrolltotop();

                    } else {
                        console.log('valid');
                        orgmmodel.save();
                        this.scrolltotop();
                        alert('Ваши данные успешно сохранены!');
                        router.navigate('main',true)

                    }
                }

            },
            renderCheck: function(user,dateopts){
                console.log('render check');
                $('#report').html(this.template.checkTpl({user:this._user}));


                $('#mo').html(this._user.mo.reduce(function(prev,next){
                    return prev +'<option>'+next.fullname+'</option>'
                },''));
                $('.date').datetimepicker({
                    format: 'DD.MM.YYYY',
                    useCurrent: false,
                    locale: 'ru-RU'
                });

                var _this = this;
                $('#mainaddform').validator().on('submit', function (e) {
                    e.preventDefault();
                    _this.renderwhoinput();
                    //_this.saveform(validator,validator.getSubmitButton().attr('name'));
                })
            },
            renderwhoinput: function() {
                $('#whoinput').html('');
                $('#alert').html('');
                var _this=this;
                var dtStart = $('#dateStart').data("DateTimePicker").date();
                var type = $('#monitoring option:selected').val();
                var mo =$('#mo option:selected').text().trim().replace(/ {2,}/g,' ');
                if (!dtStart || !dtStart.isValid()) {
                    $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка в дате</div>');
                    this.scrolltotop();
                }
                var dtEnd = $('#dateEnd').data("DateTimePicker").date();
                if (!dtEnd || !dtEnd.isValid()) {
                    $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка в дате</div>');
                    this.scrolltotop();
                }
                var util = new Utility({type:type,start:dtStart,end:dtEnd,mo:mo,username:this._user.username});

                this.post('/orgm/whoinput',
                    util.whoinput()
                    ,
                    function(err,result){
                        if(err){
                            $('#alert').html('<div class="alert alert-danger" role="alert">'+err.statusText+'</div>');
                            _this.scrolltotop();
                        } else
                        {if(result.length>0){
                            var mapping=[];
                            var columns=[];
                            var util = new Utility({type:type});
                            var info=util.schema(mapping,columns,convertSchema);
                            var data = JSON.parse(result);
                            $('#whoinput').html(_this.template.checkResultTpl({info:info,mapping:mapping,columns:columns.sort(function(a,b){return a-b;}),data:data}));
                        } else $('#whoinput').html('<h4>Нет данных</h4>');}

                });
            },
            renderAdmin: function() {
                this.renderMain('admin');
            },
            renderAdminForm: function(){
                var _this = this;
                var render = function render(){
                    $('#mainbody').html(_this.template.adminTpl({name:_this._user.username}));
                    $('.date').datetimepicker({
                        format: 'DD.MM.YYYY',
                        useCurrent: false,
                        locale: 'ru-RU',
                        showTodayButton:true

                    });
                    var options ='';

                    _this.users.forEach(function(user){
                        if(user.mo) {
                            user.mo.forEach(function (mo) {
                                if (options == '')
                                    options += '<option value="1">' + mo.fullname + '</option>';
                                else
                                    options += '<option >' + mo.fullname + '</option>'

                            });

                        }
                    })

                    $('#mo').html(options);
                    $("#mo").select2();
                };
                if(this.users){
                    render(this.users)
                } else {
                    this.post('orgm/users',{},function(err,data){
                        if(err){
                            $('#mainbody').html('<div><h3>Ошибка - '+err.status+'  '+err.statusText +'</h3></div>');
                        } else {
                            var users = JSON.parse(data);
                            _this.users = users;
                            render();
                        }
                    })
                }
;
            },
            getReport: function(button){
                $('#alert').html('');
                $(button.currentTarget).attr('id');
                var type = $('#monitoring option:selected').val();
                var mo = $('#mo option:selected').text().trim().replace(/ {2,}/g,' ');
                var sdate = $('#dateStart').data("DateTimePicker").date();
                var edate = $('#dateEnd').data("DateTimePicker").date();
                var util = new Utility({type:type,start:sdate,end:edate,mo:mo});
                var data = util.getReport($(button.currentTarget).attr('id')=='mprone');
                $.fileDownload("/orgm/report/"+JSON.stringify(data))
                    .done(function () { })
                    .fail(function (err) {
                        $('#alert').html('<div class="alert alert-danger" role="alert">Ошибка '+err+'</div>'); });
            }

        });
        var mainView = new MainView();
        var router = new Router();
        Backbone.history.start();







    });