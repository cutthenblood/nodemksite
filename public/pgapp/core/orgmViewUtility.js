define([
    'schemas/mprScm',
    'schemas/mprPDScm',
    'schemas/deathmScm',

  ], function(mprSchema,mprPDSchema,deathmSchema){
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
    var Utility = function (data){
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
        if(data.all)
            this.all = data.all;
        else
            this.all = false;

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
        this.schema = function (mapping,columns){

            var callbacks = {
                'mpr': function(){
                    convertSchema(mprSchema,mapping,columns);
                    return mprSchema[0];
                },

                'mprPD': function(){
                    convertSchema(mprPDSchema,mapping,columns);
                    return mprPDSchema[0];
                },

                'deathm': function(){
                    convertSchema(deathmSchema,mapping,columns);
                    return deathmSchema[0];
                }
            };
            return this._switch(callbacks)();
        };
        this.getReport = function (){
            var _this = this;
            var callbacks = {
                'mpr': function(){
                    var data = {};
                    data.type = _this.type;
                    data.start = _this.start.startOf('day').valueOf();
                    data.end = _this.end.startOf('day').valueOf();
                    data.mo=_this.mo;
                    data.all = _this.all;
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

    return Utility;

});