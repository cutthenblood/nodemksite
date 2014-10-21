var mongodb = require('mongodb');
var conf = require('./config.js');
var MongoClient = mongodb.MongoClient;
var moment = require('moment');
var _ = require('lodash');
//
/*MongoClient.connect(conf.mongoConnect, function (err, db) {
    if (err) {
        log.error(err);
        return;
    }
        var inputdate = new Date(moment("19.10.2014","DD.MM.YYYY").format("MM.DD.YYYY"));

        db.collection('everyday').find({inputdate: inputdate}).toArray(function (err, result) {
            var allrows = [];

            result.map(function(item){
                item.rows.map(function(row){
                    var flt = allrows.filter(function(itm){
                        if(itm.username==row.username)
                            return itm;
                    });
                    if(flt.length<1){
                        allrows.push(row);
                    }
                });




            });
            var fs = require('fs');
             var fs = require('fs');
             fs.writeFile('tst19.json', new Buffer(JSON.stringify(allrows)), function (err) {
             console.log(err);

             });
            var a=1;

        });





});*/
//    //db.collection('users').find({}).toArray(function(err,users){
//      //  if(err) return;
//        var data = [
//            ['Краснодар',[
//                ['МБУЗ Родильный дом (г. Краснодар)','II*** '],
//                ['МБУЗ Краснодарская городская клиническая больница скорой  медицинской помощи','II*** '],
//                ['ГБУЗ «Краевая клиническая больница № 2» министерства  здравоохранения Краснодарского края',' III А**** '],
//                ['ГБУЗ «Детская краевая клиническая больница» министерства  здравоохранения Краснодарского края',' III А**** ']
//
//
//                ]
//
//            ],
//            ['Туапсинский',[
//                ['МБУЗ «Туапсинская районная больница № 2»','II*'],
//                ['МБУЗ «Туапсинская районная больница № 1» ','II*** ']
//                ]
//            ],
//            ['Сочи',[
//                ['МБУЗ города Сочи «Городская больница № 1»','II*'],
//                ['МБУЗ города Сочи «Городская больница № 9»','II*** ']
//                ]
//             ]
//        ];
//
//        data.map(function(mo){
//            var mos=[];
//            mo[1].map(function(el)
//                {
//                    mos.push({'fullname':el[0],'group':el[1]})
//                }
//            );
//            db.collection('users_copy').update({'username':mo[0]},{$set: {'mo':mos} },function(err,smth){
//                console.log(mo[0],smth);
//
//            });
//
//        });
//
//
//
//
//
//
//
///*        ['Краснодар','МБУЗ Родильный дом (г. Краснодар)','II*** '],
// ['Краснодар','МБУЗ Краснодарская городская клиническая больница скорой  медицинской помощи','II*** '],
// ['Краснодар','ГБУЗ «Краевая клиническая больница № 2» министерства  здравоохранения Краснодарского края',' III А**** '],
// ['Краснодар','ГБУЗ «Детская краевая клиническая больница» министерства  здравоохранения Краснодарского края',' III А**** '],
// ['Туапсинский','МБУЗ «Туапсинская районная больница № 2»','II*'],
// ['Туапсинский','МБУЗ «Туапсинская районная больница № 1» ','II*** '],
// ['Сочи','МБУЗ города Сочи «Городская больница № 1»','II*'],
// ['Сочи','МБУЗ города Сочи «Городская больница № 9»','II*** '],*/
//
//   // });
//
//});
/*
var moment = require('moment');
var dt1 = new Date(1411726424982);
var dt = moment(dt1.valueOf());
console.log(dt.format("DD.MM.YYYY HH:MM"));*/

/*
var _ = require('lodash');

var ob = {'aitem1':[{'data':1},{'data':2}],
    'citem1':[{'data':1},{'data':2}],

            'bitem2':[{'data':1},{'data':2}]};

var res = _.chain(ob).pairs().sortBy(function(kvArray) {return kvArray[0];} )
    .zipObject().value();

var a=12;*/
var dt = moment(1413320400000).format("DD.MM.YYYY hh:mm");
var a=12;