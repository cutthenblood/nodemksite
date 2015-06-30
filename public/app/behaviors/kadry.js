// Filename: behaviors/kadry
define([
    'jquery',
    'lodash',
    'backbone',
    'marionette',
    'validator2',
    'models/session'
], function($, _, Backbone,Mn,validator,Session){


var KadryBeh = Mn.Behavior.extend({
    events: {
        'change input' :"chginput",
        'change select' :"chginput"
        //'click button.save': 'save'

    },
    scrolltotop: function(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    },

    onShow: function(){
        var _this = this;
        $('form input[type="text"]:enabled').each(function(){
            $(this).attr('data-validation-error-msg',"Вводяться только числа");
        });
        $.validate({ modules : 'html5',
            onError : function() {
                _this.scrolltotop();
                alert('Ошибка');
            },
            onValidate : function() {
                _this.save();
            }

        });

    },
    chginput: function (e) {
        if(e.currentTarget.validity.patternMismatch)
            return;
        var allsum={};
        var cnt = function(that){
            var inp = $(that)[0];
            if($(that).attr('hdr')=="")
                return false;
            if(inp.validity.patternMismatch)
                return false;
            if(isNaN(parseInt(inp.value)))
                return false;
            var elemid = inp.id;
            var elem = '#r';
            var elemAll = '#r';
            var r = parseInt(elemid.substring(1,elemid.indexOf('c')));
            var c = parseInt(elemid.substring(elemid.indexOf('c')+1));
            if(r>=55 && r<=74) {
                switch (r % 4) {
                    case 3:
                        elem += '51c' + c;
                        break;
                    case 0:
                        elem += '52c' + c;
                        break;
                    case 1:
                        elem += '53c' + c;
                        break;
                    case 2:
                        elem += '54c' + c;
                        break;
                }
                if(elem in allsum)
                    allsum[elem] += parseInt(inp.value);
                else
                    allsum[elem] = parseInt(inp.value);
            }
            var topsum = function(r,c,elemAll,allsum,val){
                switch (r % 4) {
                    case 3:
                        elemAll += '3c' + c;
                        break;
                    case 0:
                        elemAll += '4c' + c;
                        break;
                    case 1:
                        elemAll += '5c' + c;
                        break;
                    case 2:
                        elemAll += '6c' + c;
                        break;
                }
                if(elemAll in allsum)
                    allsum[elemAll] += val;
                else
                    allsum[elemAll]= val;
            };


            topsum(r,c,elemAll,allsum,parseInt(inp.value));
            return true;
        };
        $('form input[type="text"]:enabled').each(function(){
            if(!cnt(this))
                return;
            var elemid = $(this)[0].id;
            var r = parseInt(elemid.substring(1,elemid.indexOf('c')));
            var c = parseInt(elemid.substring(elemid.indexOf('c')+1));
            var inp = $(this)[0];
            if([4,5].indexOf(c)>=0){
                var el = '#r'+r+'c3';

                if(el in allsum)
                    allsum[el] += parseInt(inp.value);
                else
                    allsum[el] = parseInt(inp.value);
            }
        });
        _.forEach(allsum,function(value,key){
            $(key).val(value);
        });
        $("input[id*='c3']").each(function () {
            if(!cnt(this))
                return;
        });
        _.forEach(allsum,function(value,key){
            $(key).val(value);
        });

    },
    save: function(){
        var user = Session.get('user');

        this.view.model.set('kvartal',$('#kvartal option:selected').text());
        this.view.model.set('year',$('#year option:selected').text());
        var row={};
        row["username"]=user.username;
        row['date']=new Date();
        row['date'] =row['date'].valueOf();

        $('form input[type="text"]').each(function(inp){
            var input = $(this);
            var gr = input.attr('id');
            if(gr.indexOf('r')==-1){
                return;
            }
            if(input.val()=="")
                row[gr] = 0;
            else
                row[gr]= parseInt(input.val());
        });
        this.view.model.set('rows',[row]);
        this.view.model.save();
        alert('Ваши данные успешно сохранены!');
        this.view.destroy();
        Backbone.history.navigate('', { trigger : true });
        //window.location = '/orgmRjs';

    }
});
    if(!window.Behaviors)
        window.Behaviors = {};
    window.Behaviors.kadryB = KadryBeh;
    return KadryBeh;

});