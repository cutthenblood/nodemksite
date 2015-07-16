if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function () {
    return [
        {
            name:'info',
            type: 'info',
            row:2,
            col:5,
            fullname:'Мониторинг обеспеченности детского населения',
            uz:false,
            report:false

        },


        {
            name:'date',
            type: 'hidden',
            label: '',
            report:false
        },
        {
            name:'inputdate',
            type: 'date',
            label: 'мониторинг за',
            report:true


        },
        {
            name:'mtype',
            type: 'select',
            label: 'Тип льготы',
            values:['Федеральная','Региональная'],
            rowspan:2,
            group:true

        },
        {
            name:'rtype',
            type: 'select',
            label: 'Категория граждан',
            values:['Региональная льгота (дети до 18 лет)','в т.ч. детям - инвалидам за счёт средств СФ'],
            rowspan:2,
            hidden: true,
            group:true

        },
        {
            name:'gr2',
            type: 'number',
            required: false,
            label: 'Обеспечено пациентов с 01.01.2015г (накопительно) / Кол-во (единиц)',
            rowspan:2,
            report:true
        },
        {
            name:'gr3-4',
            type: 'subgraphs',
            label: 'Обеспечено рецептов с 01.01.2015г (накопительно)',
            colspan:2,
            sub:[
                {
                    name:'gr3',
                    type: 'number',
                    required: false,
                    label: 'Кол-во (единиц)',
                    report:true
                },{
                    name:'gr4',
                    type: 'number',
                    required: false,
                    label: 'обслужено на сумму (руб)',
                    report:true
                },

            ]
        },
        {
            name:'gr5',
            type: 'number',
            required: false,
            label: 'Находится рецептов на отсроченном обеспечении до 10 дней / Кол-во (единиц)',
            rowspan:2,
            report:true
        },{
            name:'gr6',
            type: 'number',
            required: false,
            label: ' Находится  рецептов на отсроченном обеспечении  свыше 10 дней / Кол-во (единиц)',
            rowspan:2,
            report:true
        }
    ];
});