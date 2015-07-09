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

    countInputs: function(allsum,val,r,c){

        var elem = '#r';
        var elemAll = '#r';

        if(["4","5"].indexOf(c)>=0){
            var el = '#r'+r+'c3';
            if(el in allsum)
                allsum[el] += parseInt(val);
            else
                allsum[el] = parseInt(val);
            this.countInputs(allsum,val,r,3);
        }
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
                allsum[elem] += parseInt(val);
            else
                allsum[elem] = parseInt(val);
        }
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
            allsum[elemAll] += parseInt(val);
        else
            allsum[elemAll]= parseInt(val);
    },
    chginput: function (e) {
        if(e.currentTarget.validity.patternMismatch)
            return;
        var allsum={};
        var curinp={};
        var suminp={};
        curinp["#"+e.currentTarget.id]= parseInt(e.currentTarget.value);
        var _this = this;
        $('form input[hdr!=""]').each(function(){
            var inp = $(this)[0];
            console.log(inp.id);
            if(inp.validity.patternMismatch){
                console.log("id - "+inp.id+' err - validity');
                return;}
            if(isNaN(parseInt(inp.value))) {
                console.log("id - "+inp.id+' err - NaN');
                return;
            }
            var elem = '#'+inp.id;
            if(elem.slice(-1)=="3") {
                console.log("id - "+inp.id+' err - c3');
                return;
            }
            if(!(elem in curinp))
                curinp['#'+inp.id] = parseInt(inp.value);
        });
        _.forEach(curinp,function(value,key){
            _this.countInputs(suminp,value,key.slice(0,-2).slice(2),key.slice(-1));
        });
        var a=12;
        _.forEach(suminp,function(value,key){
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