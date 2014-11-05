var bcrypt   = require('bcrypt-nodejs');
var log = require('./log.js')(module);

var User = function(fields) {
    var _this = this;
    for (var key in fields) {
        this[key] = fields[key];
    }
    this.generatesalt = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };
    this.validPassword = function(password,callback) {
       bcrypt.compare(password, _this.password, function(err, res) {
          log.info(err);
            callback(res);
        });
    };

}

module.exports = User;
var salt = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

var res = salt("6549");
var a =12;
/*var users = [
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Краевая клин. б-ца № 1 им. проф. С.В.Очаповского','password':'zrnsas','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Краевая клиническая больница № 2','password':'lmqpkx','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Краевая больница №3','password':'c3ob8t','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Детская краевая клиническая больница','password':'mx6nki','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Клинический госпиталь для ветеранов войн','password':'5c80lg','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Краевой клин. стоматологич. центр г. Краснодар, ул. Рашпилевская, 31','password':'cpiw5e','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'Центр медицинской профилактики министерства здравоохранения Краснодарского края г. Краснодар, ул. Воровского, 182.','password':'2k5ubt','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Центр восстановительной медицины и реабилитации','password':'bjr2z9','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Центр планирования семьи и репродукции адрес:','password':'lgksrh','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Мед.информационно-аналитический центр','password':'odlq8r','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Краевой мед. центр моби-лизационных резервов Резерв','password':'lcilwg','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Региональный центр медицины катастроф Российская Федерация,','password':'s9a8py','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Бюро судебно-медицинской экспертизы','password':'whtzm0','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Станция переливания крови г. Краснодар, ул. Димиртрова 166','password':'vs4r5k','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Клин. кожно-венерологич. диспансер','password':'ljf25c','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Краевой клинический онкологический диспансер №1','password':'iptfha','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗКлинический противотуб.диспансер г. Краснодар, ул. Новокузнечная, 95','password':'p13m16','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Специализированная клин. психиатрическая больница № 1','password':'o7bg5p','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Специализированная психиатрическ больница №7','password':'eq4gmt','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Клинический центр СПИД и инф. заболеваниями ул.им. Митрофана Седина, 204/2','password':'i9t290','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Детский санаторий Тополек 50061 г. Краснодар, район ГМР, ул. Благоева,17','password':'r8jobg','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Наркологический диспансер г.Краснодар, ул. Тюляева, 16','password':'484ih9','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Детский санаторий для больных туб. Ромашка Российская Федерация,','password':'26pzfo','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Детский санаторий для больных туберкулезом Василек г. Краснодар, п. Белозерный','password':'rv0bbd','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Специализированная клиническ инфекцион. б-ца г. Краснодар, ул. Седина, 204','password':'6gn0me','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Наркологический диспансер','password':'11hkdj','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Специализированная клин.детская инфекционная б-ца . Краснодар, ул.Красных Партизан, 6/5','password':'dnq2po','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГУП Кубаньфармация Одесская ул., 41 Краснодар, Краснодарский край','password':'wsxhyw','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУ Фармацевтический .центр','password':'qbtc4q','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГКУ Медицина Кубани','password':'cp2bg7','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГКУ Централиз.бух-ия','password':'xb9oww','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБОУ СПО Краснодарский краевой базовый мед. Колледж г.Краснодар ул. Таманская, 137','password':'nypy0v','division':'mmo'},
 {'moname':'Краснодар ГБУЗ','username':'ГБУЗ Дом ребенка специализированный № 1','password':'wnl9ex','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Центр восстановительной медицины и реабилитац. №2','password':'igkhqz','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Станция переливания крови № 4 (г.Новороссийск) Краснодарский край, Новороссийск г., ул. Видова, 87а','password':'fx6iiy','division':'mmo'},
 {'moname':'Новороссийск','username':'Новороссийский филиал ГБУЗ Наркологический диспансер г. Новороссийск, ул. Золотаревского, 2 А','password':'yezwge','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Кожно-венерологический диспансер № 8 г. Новороссийск, ул. К. Маркса, 24.','password':'nawvuf','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Онкологический диспансер № 3','password':'1x8kc7','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Противотуберкулезный диспансер № 23 Российская Федерация,','password':'7lyz1t','division':'mmo'},
 {'moname':'Новороссийск','username':'Новороссийский филиал ГБУЗ Геленджикский псих диспансер Краснодарский край, Новороссийск г., ул. Революции 190','password':'xbnx4y','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Дезинфекц.станция г.Новороссийска Российская Федерация,','password':'9w2y8n','division':'mmo'},
 {'moname':'Новороссийск','username':'Государственное бюджетное учреждение здравоохранения "Центр профилактики и борьбы со СПИД № 4" министерства здравоохранения Краснодарского края','password':'ilo697','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Инфекционная больница № 3 Новороссийск ул. Революции 190','password':'dh67vu','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБОУ Новороссийский медицинский колледж','password':'3ughp6','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗДом ребенка спец. № 4','password':'vt39e1','division':'mmo'},
 {'moname':'Новороссийск','username':'ГБУЗ Дезинфекц.станция г.Новороссийска Российская Федерация,','password':'mq1xgj','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Бюро суд-медицинской экспертизы № 2','password':'yoecam','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Станция переливания крови №','password':'38pzh3','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Онкологический диспансер № 2','password':'c7siks','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Противотуберкулезный диспансер № 1 Сочи, Центральный район, улица Дагомысская, 44','password':'ugh7qe','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Наркологический диспансер № 2 г. Сочи, ул. Пластунская, д. 157.','password':'73vqmk','division':'mmo'},
 {'moname':'Сочи','username':'Противотуберкулёзный диспансер №2','password':'ksvj9s','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Противотуберкулезный диспансер № 3','password':'ql71wr','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Кожно-венерологич диспансер № 2 г Сочи, ул. Дагомысская, д. 42/а','password':'w8dw0a','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Психоневрологический диспансер № 3 г. Сочи, ул. Дагомысская, 48','password':'ty9c0k','division':'mmo'},
 {'moname':'Сочи','username':'Государственное бюджетное учреждение здравоохранения "Центр профилактики и борьбы со СПИД № 3" министерства здравоохранения Краснодарского края','password':'2j0dvz','division':'mmo'},
 {'moname':'Сочи','username':'ГБОУ Сочинский мед. Колледж Краснодарский край, Сочи г, Орджоникидзе, 25','password':'pjqfue','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Детский санаторий Горный воздух','password':'73grrh','division':'mmo'},
 {'moname':'Сочи','username':'Государственное бюджетное учреждение здравоохранения Инфекционная больница №2 министерства здравоохранения Краснодарского края. 354207 Краснодарский рай, гор. Сочи, Лазаревский район, с. Ордынка, Барановское шоссе 17','password':'cdi7zf','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Дом ребенка спец №','password':'nnr63r','division':'mmo'},
 {'moname':'Сочи','username':'ГБУЗ Наркологический г. Сочи, ул. Пластунская, д. 157. диспансер № 2','password':'ox0gqk','division':'mmo'},
 {'moname':'Абинский Р-Н','username':'ГКУ Лепрозорий','password':'vbil2h','division':'mmo'},
 {'moname':'Абинский Р-Н','username':'ГБУЗ Специализированная психиатрическ больница № 2','password':'rc01am','division':'mmo'},
 {'moname':'Белореченск','username':'ГБУЗ Станция переливания крови № 2 Краснодарский край,','password':'oyo28s','division':'mmo'},
 {'moname':'Белореченск','username':'Белореченский филиал ГБУЗ Наркологический диспансер г. Белореченск, ул. Аэродромная, 5','password':'gd605o','division':'mmo'},
 {'moname':'Белореченск','username':'ГБОУ Белореченский мед. Колл Краснодарский край, г. Белореченск, ул. 40 лет ВЛКСМ, 129-А','password':'64e3lm','division':'mmo'},
 {'moname':'Белореченск','username':'Белореченский филиал ГБУЗ Клин. кож-венер. диспансера','password':'zjd6me','division':'mmo'},
 {'moname':'Белореченск','username':'ГБУЗ Противотуберкулезный диспансер №6 МЗ КК (Белореченский р-он)','password':'g6oz8k','division':'mmo'},
 {'moname':'Кореновск','username':'ГБУЗ Станция переливания крови № 3','password':'f7gftm','division':'mmo'},
 {'moname':'Анапа','username':'Анапский фил. ГБУЗ Клин. кож-венер. диспансера','password':'7qwkp3','division':'mmo'},
 {'moname':'Славянск','username':'Славянский фил. ГБУЗ Клин. кож-венер. диспансера','password':'at9jrw','division':'mmo'},
 {'moname':'Славянск','username':'ГБУЗ Противотуберкулезный диспансер №12 МЗ КК (Славянский р-он)','password':'d6y841','division':'mmo'},
 {'moname':'Кропоткин','username':'Кропоткинский фил. ГБУЗ Клин. кож-венер. диспансера','password':'jpr5r2','division':'mmo'},
 {'moname':'Кропоткин','username':'ГБОУ Кропоткинский медицинский колледж','password':'6bpr40','division':'mmo'},
 {'moname':'Кропоткин','username':'ГБУЗ Противотуберкулезный диспансер №4 МЗ КК 352396 г. Кропоткин, ул. Дорожная, д. 17','password':'wcmwpj','division':'mmo'},
 {'moname':'Темрюк','username':'Темрюкский фил. ГБУЗ Клин. кож-венер. диспансера','password':'sf7943','division':'mmo'},
 {'moname':'Темрюк','username':'Темрюксикй филиал ГБУЗ Противотуберкулезный диспансер №12 МЗ КК','password':'1c5csx','division':'mmo'},
 {'moname':'Тихорецк','username':'Тихорецкий филиал ГБУЗ Клин. кож.венер. диспансера','password':'rsokj9','division':'mmo'},
 {'moname':'Туапсе','username':'Туапсинский филиал ГБУЗ Клин. кож-вен. диспансера','password':'cs83i9','division':'mmo'},
 {'moname':'Туапсе','username':'Туапсинский филиал ГБУЗ Нарко. диспансер № 2 г. Туапсе, Ул. Сочинская, 80','password':'mqahs2','division':'mmo'},
 {'moname':'Туапсе','username':'ГБУЗ Психоневрологический диспансер № 4 г. Туапсе, ул.Маяковского, 2','password':'m3ksm','division':'mmo'},
 {'moname':'Туапсе','username':'Государственное бюджетное учреждение здравоохранения Центр профилактики и борьбы со СПИД №2 министерства здравоохранения Краснодарского края','password':'n8ecn9','division':'mmo'},
 {'moname':'Туапсе','username':'ГБУЗ Противотуберкулезный диспансер №10 МЗ КК (г. Туапсе)','password':'y8dbs3','division':'mmo'},
 {'moname':'Приморско-Ахтарск','username':'Приморско-Ахтарский филиал ГБУЗ Клин. кож-венер. дисп','password':'tmw68c','division':'mmo'},
 {'moname':'Приморско-Ахтарск','username':'ГБУЗ Специализированная психиатрическая больница № 4 департамента здравоохранения Краснодарского края','password':'6tieo8','division':'mmo'},
 {'moname':'Приморско-Ахтарск','username':'Приморско-Ахтарский филиал ГБУЗ КПТД МЗ КК','password':'45doqv','division':'mmo'},
 {'moname':'Ейск','username':'ГБУЗ Ейский кожно-венерологическ диспансер','password':'zg1vw6','division':'mmo'},
 {'moname':'Ейск','username':'ГБУЗ Онкологический диспансер № 4 г. Ейск, ул. Энгельса, 156','password':'x19ohb','division':'mmo'},
 {'moname':'Ейск','username':'Ейский филиал ГБУЗ Специал. наркологическая больница','password':'mrvdzm','division':'mmo'},
 {'moname':'Ейск','username':'ГБУЗ Станция переливания крови № 5 Краснодарский край, г.Ейск, ул.Энгельса, 156','password':'m2he3n','division':'mmo'},
 {'moname':'Ейск','username':'ГБУЗ Ейский психоневрологический диспансер департамента здравоохранения Краснодарского края','password':'nukqhk','division':'mmo'},
 {'moname':'Ейск','username':'ГБУЗ Противотуберкулезный диспансер №7 МЗ КК (Ейский р-он)','password':'31v2by','division':'mmo'},
 {'moname':'Ейск','username':'Государственное бюджетное учреждение здравоохранения Ейский центр профилактики и борьбы со СПИД министерства здравоохранения Краснодарского края 353690 г.Ейск, ул. Энгельса, 156','password':'g8fpug','division':'mmo'},
 {'moname':'Ейск','username':'ГБОУ Ейский мед. Колледж','password':'71rb6r','division':'mmo'},
 {'moname':'Ейск','username':'ГБУЗ Дом ребенка специали-зированный № 5','password':'7q2z5q','division':'mmo'},
 {'moname':'Ейск','username':'Кущевский филиал ГБУЗ Ейский кож-вен. диспансер','password':'li3ggn','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Армавирский кожно- вен. диспансер г. Армавир, ул. Кирова, 64','password':'lc3h76','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Наркологический диспансер № 3','password':'hygm7i','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Армавирский противо-туберкулезный диспансер г. Армавир, ул.Ефремова, 254','password':'522x6k','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Психоневрологический диспансер № 2 Краснодарский край, Армавир г., ул. Ленина, 110','password':'carfho','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Станция переливания крови № 6','password':'vv2aex','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Армавирский дом ребенкаг. Армавир, ул. Тургенева,126','password':'zzlh4x','division':'mmo'},
 {'moname':'Армавир','username':'ГБОУ Армавирский мед колледж','password':'fmw6pr','division':'mmo'},
 {'moname':'Армавир','username':'государственное бюджетное учреждение здравоохранения Инфекционная больница № 4 министерства здравоохранения Краснодарского края','password':'mpgd3r','division':'mmo'},
 {'moname':'Армавир','username':'ГБУЗ Армавирский онкологический диспансер Краснодарский край г.Армавир, ул. маршала Жукова, 177','password':'i1xyyr','division':'mmo'},
 {'moname':'Динской р-н','username':'Динской филиал ГБУЗ Клин противотуб .диспансер','password':'zjlhwu','division':'mmo'},
 {'moname':'Гор. Ключ','username':'Горячеключевской филиал ГБУЗ г. Горячий ключ, ст. Саратовская, ул Шоссейная, 43а. Клин. противотуб .диспансер','password':'stbk6p','division':'mmo'},
 {'moname':'Гор. Ключ','username':'ГБ ОУ Горячеключевской медицинский колледж 353290 г. Горячий Ключ ул. Ленина 34 а','password':'usx1ox','division':'mmo'},
 {'moname':'Лабинск','username':'Лабинский филиал ГБУЗ Армавирский противотуберкулезный диспансер','password':'qxtuv8','division':'mmo'},
 {'moname':'Лабинск','username':'Лабинский филиал ГБУЗ СПБ №:6','password':'ej258q','division':'mmo'},
 {'moname':'Лабинск','username':'ГОУ Лабинский мед. колледж','password':'rf5qo6','division':'mmo'},
 {'moname':'Лабинск','username':'Лабинский филиал ГБУЗ Армавирский кож-вен. диспан г. Лабинск, ул. Гагарина 166','password':'1swevt','division':'mmo'},
 {'moname':'Отрадненский р-н','username':'Отрадненский филиал ГБУЗ Армавирский противотуберкулезный диспансер','password':'xyahqb','division':'mmo'},
 {'moname':'Отрадненский р-н','username':'ГБУЗ Специализированная психиатрическая больница № 6 департамента здравоохранения Краснодарского края','password':'yboqzt','division':'mmo'},
 {'moname':'Геленджик','username':'ГБУЗ Геленджикский противотуб. диспансер','password':'w4djze','division':'mmo'},
 {'moname':'Геленджик','username':'ГБУЗ "Детский санаторий для лечения туберкулеза всех форм "Ласточка" министерства здравоохранения Краснодарского края','password':'pd51mw','division':'mmo'},
 {'moname':'Геленджик','username':'ГБУЗ Детский санаторий имени Н.И.Пирогова','password':'4z69bj','division':'mmo'},
 {'moname':'Геленджик','username':'ГБУЗ Геленджикский психоневрологический диспансер департамента здравоохранения Краснодарского края','password':'91wnl2','division':'mmo'},
 {'moname':'Тбилисский','username':'Шереметьевский филиал ГБУЗ Противотуберкулезный диспансер №4 МЗ КК','password':'nkwng8','division':'mmo'},
 {'moname':'Гулькевичи','username':'Гулькевичский филиал ГБУЗ Противотуберкулезный диспансер №4 МЗ КК','password':'prt1nl','division':'mmo'},
 {'moname':'Апшеронск','username':'Апшеронский филиал ГБУЗ Противотуберкулезный диспансер №6 МЗ КК','password':'oyp6g5','division':'mmo'},
 {'moname':'Щербинский','username':'Щербиновский филиал ГБУЗ Противотуберкулезный диспансер №7 МЗ КК','password':'wqtsig','division':'mmo'},
 {'moname':'Новоминский','username':'Новоминской филиал ГБУЗ Противотуберкулезный диспансер №7 МЗ КК','password':'jy1ege','division':'mmo'},
 {'moname':'Курганиск','username':'Курганинский филиал ГБУЗ Армавирский противотуберкулезный диспансер','password':'f1vank','division':'mmo'},
 {'moname':'Выселковский','username':'ГБУЗ Противотуберкулезный диспансер №13 МЗ КК (Выселковский р-он)','password':'8olkfk','division':'mmo'},
 {'moname':'Выселковский','username':'ГБУЗ Специализированная психоневрологическая больница департамента здравоохранения краснодарского края','password':'rvroeh','division':'mmo'},
 {'moname':'Усть лабинский','username':'ГБУЗ Противотуберкулезный диспансер №14 МЗ КК (Усть-Лабинский р-он)','password':'stzaz4','division':'mmo'},
 {'moname':'Усть лабинский','username':'ГБУЗ Дом ребенка спец. №3 Усть-Лабинск, Воронежская ул., 1','password':'evimbn','division':'mmo'},
 {'moname':'Усть лабинский','username':'ГБУЗ Специализированная психиатрическая больница № 5 департамента здравоохранения Краснодарского края','password':'m1ihow','division':'mmo'},
 {'moname':'Староминский','username':'ГБУЗ Противотуберкулезный диспансер №16 МЗ КК (Староминский р-он)','password':'trdp9r','division':'mmo'},
 {'moname':'Кущевка','username':'ГБУЗ Противотуберкулезный диспансер №18 МЗ КК (Кущевской р-он)','password':'qhhvvg','division':'mmo'},
 {'moname':'Кущевка','username':'ГБОУ Кущёвский мед. Колледж 352030 Краснодарский край ст-ца Кущёвская ул. Ленинградская, 78','password':'snrt45','division':'mmo'},
 {'moname':'Кущевка','username':'ГБУЗ Специализированная психиатрическая больница № 3 департамента здравоохранения Краснодарского края','password':'vg622x','division':'mmo'},
 {'moname':'Крымск','username':'ГБУЗ Противотуберкулезный диспансер №20 ДЗ КК (Крымский р-он)','password':'q87zed','division':'mmo'},
 {'moname':'Красноармейский р-н','username':'ГБУЗ Спец.наркологическая больница ст.Полтавская','password':'ktc465','division':'mmo'},
 {'moname':'Кавказкий р-н','username':'Кавказский филиал ГБУЗ "Специализированная психоневрологическая больница" министерства здравоохранения Крвснодарского края','password':'8s7lvv','division':'mmo'}
];

var mongodb = require('mongodb');
var conf = require('./config.js');
var MongoClient = mongodb.MongoClient;

MongoClient.connect(conf.mongoConnect, function (err, db) {
    if (err) {
        log.error(err);
        return;
    }
        users.map(function(user){
            user.password = salt(user.password);
            db.collection('users').insert(user,function(err,smth){
            console.log("err-"+err+" res - "+smth);

            });
        });
});*/
