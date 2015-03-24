$(document).ready(function () {
    var kadryModel = Backbone.Model.extend({
        url: '/kadry/uploadform',
        validate: function (attrs) {
            return null;
        }

    });
    var kadryM = new kadryModel();
    var MainView = Backbone.View.extend({
        el: $('#mainbody'),
        isvalid: false,
        events: {
            'change input': 'chginput',
            'click button#save': 'save'

        },
        initialize: function () {
            console.log('init');
            var _this = this;
            $('#mainbody')

                .on('valid.fndtn.abide', _this.validate);
        },
        validate : function(){
            this.isvalid = true;
        },
        chginput: function (e) {
            if($( e.currentTarget ).attr( "data-invalid" )!=undefined)
                return;
            var id = e.currentTarget.id;

            var r = parseInt(id.substring(1,id.indexOf('c')));
            var c = parseInt(id.substring(id.indexOf('c')+1));
            var elem = '#r';

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
                var sum = 0;
                if ($(elem).val() != "")
                    sum = parseInt($(elem).val());
                sum += parseInt(e.currentTarget.value);
                $(elem).val(sum);
                elem = '#r';
            }

                switch (r % 4) {
                    case 3:
                        elem += '3c' + c;
                        break;
                    case 0:
                        elem += '4c' + c;
                        break;
                    case 1:
                        elem += '5c' + c;
                        break;
                    case 2:
                        elem += '6c' + c;
                        break;
                }


            var sum = 0;
            if($(elem).val()!="")
                sum = parseInt($(elem).val());
            sum += parseInt(e.currentTarget.value);
            $(elem).val(sum);

            //alert(e.currentTarget);
        },
        save: function(){
            if(!this.isvalid) {
                $('#myModal').foundation('reveal', 'open');
            return;
            }

            var row={};
            row["username"]=$('#motitle').text().trim().replace('\n','');
            row["kvartal"]=$('#kvartal').text().trim().replace('\n','');
            $('form input[type="text"]').each(
                function (index) {
                    var input = $(this);
                    var gr = input.attr('id');
                    if(gr.indexOf('r')==-1){
                        return;
                    }
                    row[gr]= parseInt(input.val());

                });


        }



    });


    var mainView = new MainView();
});