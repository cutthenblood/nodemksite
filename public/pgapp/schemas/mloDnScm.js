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
            uz:false

        },
        {
            name:'inputdate',
            type: 'date',
            label: 'мониторинг за'

        },
        {
            name:'date',
            type: 'hidden',
            label: ''
        },
        {
            name:'mtype',
            type: 'select',
            label: 'Тип льготы',
            values:['Федеральная','Региональная'],
            rowspan:2
        },
        {
            name:'gr2',
            type: 'number',
            required: false,
            label: 'Обеспечено пациентов с 01.01.2015г (накопительно) / Кол-во (единиц)',
            rowspan:2
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
                    label: 'Кол-во (единиц)'
                },{
                    name:'gr4',
                    type: 'number',
                    required: false,
                    label: 'обслужено на сумму (руб)'
                },

            ]
        },
        {
            name:'gr5',
            type: 'number',
            required: false,
            label: 'Находится рецептов на отсроченном обеспечении до 10 дней / Кол-во (единиц)',
            rowspan:2
        },{
            name:'gr6',
            type: 'number',
            required: false,
            label: ' Находится  рецептов на отсроченном обеспечении  свыше 10 дней / Кол-во (единиц)',
            rowspan:2
        }
    ];
});