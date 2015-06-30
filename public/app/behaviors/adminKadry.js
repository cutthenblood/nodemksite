// Filename: behaviors/check
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'validator',
    'select2',
    'datepicker',
    'core/orgmViewUtility',
    'schemas/datesScm',
    'text!templates/whoinputTpl.ejs',
    'pako',
    'core/utls'
], function($, _, Backbone,Mn,Validator,S2,Picker,Utility,date,resultTpl,Pako,Utls){

    function base64toBlob(base64Data, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        var byteCharacters = atob(base64Data);
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        return new Blob(byteArrays, { type: contentType });
    };
    var adminBehKadry = Mn.Behavior.extend({
        events: {
            'change select#monitoring': 'monitChange',
            'click button.whoinput': 'renderwhoinput',
            'click button.report': 'getReport',
            'change input#all':     'chkbxall'

        },
        /*collectionEvents: {
            sync: "render"
        },*/
        chkbxall: function(e){
            if(e.currentTarget.checked)
                {
                        $("#mo > option").prop("selected","selected");
                        $("#mo").trigger("change");
                      }

            else
                {
                    $("#mo > option").removeAttr("selected");
                    $("#mo").trigger("change");
                }

        },
        viewUsers: function(type){
            var options='';
            this.view.users.forEach(function(usr){
                var user = usr.toJSON();
                if(user.division!='orgm') return;
                  if(type == 'deathm'){
                    options += '<option>' + user.username + '</option>';
                }else {
                    if(user.uz && type =='mprPD')
                        options += '<option>' + user.uz + '</option>'
                    if(user.mo)
                        user.mo.forEach(function (mo) {
                            options += '<option>' + mo.fullname + '</option>'
                        });
                }
            });
            return options;
        },
        monitChange: function(e){
            var type = e.currentTarget.value;
            if(type=='mpr'){
                $('#mo').html(this.viewUsers(type));
                $('.dmdis').removeAttr('disabled','disabled');
            }
            else if(type=='mprPD'){
                $('#mo').html(this.viewUsers(type));
                $('.dmdis').removeAttr('disabled','disabled');
            }
            else if(type == 'deathm'){
                $('#mo').html(this.viewUsers(type));
                $('.dmdis').attr('disabled','disabled');
            }
            $('.date').each(function(dt) {
                var dtp = $(this).data('DateTimePicker');
                if(dtp)
                    $(this).data('DateTimePicker').options(date[type]);
                else
                    $(this).datetimepicker(date[type]);
            });

        },
        renderwhoinput: function(e) {
            var _this = this;
            e.preventDefault();
            $('#whoinput').html('');
            $('#alert').html('');
            var _this=this;

            var data = {
                kstart:$('#kstart option:selected').text(),
                kend:$('#kend option:selected').text(),
                ystart:$('#ystart option:selected').text(),
                yend:$('#yend option:selected').text(),
                type:$('#monitoring option:selected').val()};
            var whoinp = $.ajax({
                url : '/whoinput',
                data : data,
                type : 'POST'
            });

            whoinp.done(function(result){
                if(result.length>0){
                    var mapping=[];
                    var columns=[];
                    //var util = new Utility({type:type});
                    //var info=util.schema(mapping,columns);
                    var data = JSON.parse(result);
                    $('#whoinput').html(_.template(resultTpl,{table:data}));
                    //$('#whoinput').html(_this.view.template.checkResultTpl({info:info,mapping:mapping,columns:columns.sort(function(a,b){return a-b;}),data:data}));
                } else
                    $('#whoinput').html('<h4>Нет данных</h4>');
                //$('#whoinput').html('<h4>Нет данных</h4>');}

            });
            whoinp.fail(function(err){
                $('#alert').html('<div class="alert alert-danger" role="alert">'+err.statusText+'</div>');
                return;

            });
        },
        onShow: function(){

            this.render();
        },
        getReport: function(button){
            button.preventDefault();
            $('#alert').html('');
            var mo =[];
            $('#mo option:selected').each(function(){
                mo.push($(this).text())
            });
            var data = {
                kstart:$('#kstart option:selected').text(),
                kend:$('#kend option:selected').text(),
                ystart:$('#ystart option:selected').text(),
                yend:$('#yend option:selected').text(),
                mos:mo,
                type:$('#monitoring option:selected').val()};
            Utls.uploadFile('/kadry/report/',"cp",Array.prototype.join.call(Pako.gzip(JSON.stringify(data))));
        },
        render: function(){
            console.log('kadry render');
            //this.$('.zerg')
            //this.view.collection.deffered.done(function(){


            var _this = this;
            this.view.collection.deferred
                .done(function () {

                    _this.$el.html(_this.view.template(_this.view.serializeData()) );
                    $('#mo').select2({tags: "true",
                        placeholder: "Выберите"});
                    $('.date').datetimepicker({ viewMode: 'years',
                            format: 'MM/YYYY',
                            locale: 'ru-RU',
                            useCurrent: false});




                });
            //})

        }
    });
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.adminBehKadry = adminBehKadry;
    return adminBehKadry;

});