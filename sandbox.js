var mongodb = require('mongodb');
var conf = require('./config.js');
var MongoClient = mongodb.MongoClient;
var moment = require('moment');
var _ = require('lodash');
var vow = require('vow');
var vowNode = require('vow-node');

//
MongoClient.connect(conf.mongoConnect, function (err, db) {
    if (err) {
        log.error(err);
        return;
    }

    var psls = {
        first: vowNode.invoke(db.collection('orgmMpr').aggregate({$match: {inputdate: {$gte: 1191371200000}}}).toArray),
        second: vowNode.invoke(db.collection('orgmMpr').aggregate({$match: {inputdate: {$gte: 1191371200000}}}).toArray)
    };
    vow.all(psls).then(
        function (err, resutl) {
            var a = 12;
        });


    mongodb.Collection.prototype.aggregate = vowNode.promisify( mongodb.Collection.prototype.aggregate);
    mongodb.Cursor.prototype.toArray = vowNode.promisify( mongodb.Cursor.prototype.toArray);

        var psls = {"first":db.collection('orgmMpr').aggregate({$match:{inputdate:{$gte:1191371200000} }}),
        "second":db.collection('orgmMpr').aggregate({$match:{inputdate:{$gte:1191371200000} }})}

vow.all(psls).then(
    function(err,resutl){
        var a = 12;
    })




});
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
