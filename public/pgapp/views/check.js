// Filename: views/check
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'behaviors/check',
    'text!templates/checkTpl.ejs',
    'text!templates/checkResultTpl.ejs',
    'models/session',
    'models/orgm',

], function($, _, Backbone,Mn,CheckBeh, template,result,Session,orgmModel){
    var checkView = Mn.LayoutView.extend({
        template: _.template(template),
        resultTemplate: _.template(result),

        behaviors: {
            'checkB': CheckBeh

        },
        initialize: function(){
            this.user = Session.get('user');
            var model = new orgmModel();
            model.set('user',Session.get('user'));
            this.model = model;
            $('#monitoring').trigger('change');
        },
        onShow: function(){
            $('#monitoring').trigger('change');
        },

    });
    // Our module now returns our view
    return checkView;
});