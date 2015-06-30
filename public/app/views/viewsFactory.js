// Filename: views/viewsFactory
define([

    'lodash',
    'backbone',
    'marionette',
    'schemas/mprScm',
    'schemas/mprPDScm',
    'schemas/deathmScm',
    'schemas/infoMessages',
    'models/orgm',
    'models/session',
    'behaviors/orgm',
    'text!templates/monitoringTpl.ejs',
    'validator',
    'datepicker'
], function( _, Backbone,Mn, mprscm,mprPDscm,deathmscm,infoMes,orgmModel,Session,OrgmBeh,template,validator,picker){

    var schemas = {'mpr':mprscm,'mprPD':mprPDscm,'deathm':deathmscm};

    var orgmView = Mn.ItemView.extend({
        template : _.template(template),
        behaviors: {
            'orgmB': OrgmBeh
        },
        initialize: function(type){
            this.type = type;
            var model = new orgmModel();
            model.setModel(type.type);
            model.set('user',Session.get('user'));
            model.set('table',schemas[type.type]);
            model.set('info',infoMes.orgm.filter(function(itm){ if (itm.type == type.type) return itm;})[0].message);
            this.model = model;
        },


        name:'orgmView'
    });
    return orgmView;


    /*var viewsFactory = function(type){
        this._type = type;
        this.generate = function(user,scm){
            var view = BaseView.extend({
                 template: _.template(template),
                initialize: function(user){
                  this.user = user;
                },
                render: function(){
                    $('#content').html( this.template({user:this.user,'table':scm}) );
                }
            });
            return new view(user);
        }
    };
    viewsFactory.prototype.getView = function(user){
        var _this = this;

        switch(this._type){
            case 'mpr': {
                return _this.generate(user,mprscm);

                break;}
            case 'mprPD': {
                return _this.generate(user,mprPDscm);
                break;}
            case 'deathm': {
                return _this.generate(user,deathmscm);
                break;}
        }

    };
    return viewsFactory;*/
});