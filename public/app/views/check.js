// Filename: views/check
define([
    'jquery',
    'underscore',
    'backbone',
    'marionette',
    'behaviors/check',
    'text!templates/checkTpl.ejs',
    'text!templates/checkResultTpl.ejs',
    'models/session'

], function($, _, Backbone,Mn,CheckBeh, template,result,Session){
    var checkView = Mn.LayoutView.extend({
        template: _.template(template),
        resultTemplate: _.template(result),

        behaviors: {
            'checkB': CheckBeh

        },
        initialize: function(){
            this.user = Session.get('user');
            $('#monitoring').trigger('change');
        },
        onShow: function(){
            $('#monitoring').trigger('change');
        },

    });
    // Our module now returns our view
    return checkView;
});