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

var _ = require('lodash');
var result = [

    {
        "_id" : "54322060d4b1200376b52011",
        "clientid" : "54322060d4b1200376b52011",
        "claimnum" : 0,
        "manager" : "540417349eed9f2b571227d6",
        "mactive" : true
    },
    {
        "_id" : "542e9f62cc5fd687063235f8",
        "clientid" : "542e9f62cc5fd687063235f8",
        "claimnum" : 0,
        "manager" : "540d5a48713e4a1b5c284faa",
        "mactive" : false
    },
    {
        "_id" : "542e9f62cc5fd687063235f8",
        "clientid" : "542e9f62cc5fd687063235f8",
        "claimnum" : 0,
        "manager" : "540ea2d4e8e84ddeb47add8d",
        "mactive" : false
    },
    {
        "_id" : "542e9f62cc5fd687063235f8",
        "clientid" : "542e9f62cc5fd687063235f8",
        "claimnum" : 0,
        "manager" : "540417349eed9f2b571227d6",
        "mactive" : true
    },
    {
        "_id" : "54322055d4b1200376b5200d",
        "clientid" : "54322055d4b1200376b5200d",
        "claimnum" : 0,
        "manager" : "540d5a48713e4a1b5c284faa",
        "mactive" : false
    },
    {
        "_id" : "54322055d4b1200376b5200d",
        "clientid" : "54322055d4b1200376b5200d",
        "claimnum" : 0,
        "manager" : "540ea2d4e8e84ddeb47add8d",
        "mactive" : true
    }
];

var resres=[];
_.chain(result)
           .groupBy(function(itm){ return itm._id})
           .groupBy(function(itm){
            var tmp ={};
            tmp.mln = (itm.length>1)?1:0;
            tmp.manager = itm.filter(function(mgr){if(mgr.mactive) return mgr;})
            if(tmp.manager) tmp.manager = tmp.manager[0].manager;
            resres.push(tmp);
            });
var re= _.groupBy(resres,function(itm){ return itm.manager;})

var a= 12;