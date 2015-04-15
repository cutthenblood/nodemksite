var url = require('url');
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/deathmonitor');
}


module.exports = function (app) {
    app.get('/deathmonitor/fillfrm', isLoggedIn,function (req, res) {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        var iznih1=[
            {
            "gr":"3",
            "label":"в стационаре"
        },
            {
                "gr":"4",
                "label":"на дому"
            },
            {
                "gr":"5",
                "label":"в др. местах"
            }];
        var iznih2=[
            {
            "gr":"6",
            "label":"вскрыто ПАО"
        },
            {
                "gr":"7",
                "label":"без вскрытия"
            }];
        
        var data = {
             "iznih1":[{
                "gr":"3",
                "label":"в стационаре"
            },
                {
                    "gr":"4",
                    "label":"на дому"
                },
                {
                    "gr":"5",
                    "label":"в др. местах"
                }],
        "iznih2":[{
            "gr":"6",
            "label":"вскрыто ПАО"
        },
            {
                "gr":"7",
                "label":"без вскрытия"
            }],
            "zp":[
                {
                    "gr":"8",
                    "label":"Хр.ревматические болезни сердца",
                    "code":"I 05_I 09"
                    
                },
                {
                    "gr":"9",
                    "label":"Артериальные гипертензии",
                    "code":"I 10_I 15"
                },
                {
                    "gr":"10",
                    "label":"ИБС",
                    "code":"I 20_I 25"
                },
                {
                    "gr":"11",
                    "label":"Стенокардии",
                    "code":"I 20.0- 20.9"
                },
                {
                    "gr":"12",
                    "label":"Инфаркт миокарда",
                    "code":"I 21_I 22"
                },
                {
                    "gr":"13",
                    "label":"Атеросклеротическая болезнь сердца",
                    "code":"I 25.1, I 25.3"
                },
                {
                    "gr":"14",
                    "label":"Тромбоэмболия",
                    "code":"I 26"
                },
                {
                    "gr":"15",
                    "label":"Другие болезни сердца",
                    "code":"I 30_I 49"
                },
                {
                    "gr":"16",
                    "label":"Сердечная недостаточность",
                    "code":"I 50-I 59"
                },
                {
                    "gr":"17",
                    "label":"ЦВБ",
                    "code":"I 60_I 69"
                },
                {
                    "gr":"18",
                    "label":"Инсульты",
                    "code":"I 60-I 64"
                },
                {
                    "gr":"19",
                    "label":"Прочие",
                    "code":"I 70- I99"
                }
                
            ],
            "ost":[
                  {
                    "gr":"32",
                    "label":"R 54"
                },
                {
                    "gr":"33",
                    "label":"Введено в Парус сведетельств, умерших от БСК"
                }
            ]
            
            
            
        }

        res.render('deathmonitor/fillfrm', {"name": req.user.username,"data":data });
    });
}
