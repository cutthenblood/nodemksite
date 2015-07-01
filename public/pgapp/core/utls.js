define([
    'schemas/mprScm',
    'schemas/mprPDScm',
    'schemas/deathmScm',

], function(mprSchema,mprPDSchema,deathmSchema){
    var Utility = function () {

        this.uploadFile = function (url, key, data) {
            // Build a form
            var form = $('<form></form>').attr('action', url).attr('method', 'post').attr("target", "_blank");
            // Add the one key/value
            form.append($("<input></input>").attr('name', key).attr('value', data));
            //send request
            form.appendTo('body').submit().remove();
        };
    };

    return new Utility();

});