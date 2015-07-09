// Filename: views/viewsFactory
define([

    'underscore',
    'backbone',
    'marionette',
    'schemas/mprScm',
    'schemas/mprPDScm',
    'schemas/deathmScm',
    'schemas/infoMessages',
    'schemas/mloDnScm',
    'models/orgm',
    'models/session',
    'behaviors/orgm',
    'text!templates/monitoringTpl.ejs',
    'validator',
    'datepicker'
], function( _, Backbone,Mn, mprscm,mprPDscm,deathmscm,infoMes,mloDn,orgmModel,Session,OrgmBeh,template,validator,picker){

    var schemas = {'mpr':mprscm,'mprPD':mprPDscm,'deathm':deathmscm,'mlodn':mloDn};

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

});