//var mongodb = require('mongodb');
//var conf = require('./config.js');
//var MongoClient = mongodb.MongoClient;
//
//MongoClient.connect(conf.mongoConnect, function (err, db) {
//    if (err) {
//        log.error(err);
//        return;
//    }
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

var arr = [-3,-3,56,7,8,0,0,1,-8,5];
var srt = arr.sort(function(a,b){ return b-a;});

var a=129;