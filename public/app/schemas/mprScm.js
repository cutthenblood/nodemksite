define(function () {
    return [
        {
            name:'info',
            type: 'info',
            row:4,
            col:30,
            fullname:'Mониторинг преждевременных родов',
            mo: true
        },

        {
            name:'gr5',
            type: 'number',
            required: true,
            label: 'Родов всего',
            rowspan:4
        },
        {
            name:'gr6-13',
            type: 'subgraphs',
            label: 'Из низ преждевременных родов:',
            colspan:7,
            sub: [
                {
                    name:'gr6',
                    type: 'number',
                    required: false,
                    label: 'абс.',
                    rowspan:3
                },
                {
                    name:'gr8',
                    type: 'number',
                    required: false,
                    label: ' Многоплодных',
                    rowspan:3
                },
                {
                    name:'gr9-13',
                    type: 'subgraphs',
                    label: ' В том числе:',
                    colspan:5,
                    sub:[
                        {
                            name:'gr9',
                            type: 'number',
                            required: false,
                            label: 'В том числе, у находящихся на лечении в ЛПМО более 24 часов',
                            rowspan:2

                        },
                        {
                            name:'gr10-11',
                            type: 'subgraphs',
                            label: 'Спонтанных:',
                            colspan:2,
                            sub:[
                                {
                                    name:'gr10',
                                    type: 'number',
                                    required: false,
                                    label: 'С началом регулярной родовой деятельности при целом плодном пузыре'
                                },
                                {
                                    name:'gr11',
                                    type: 'number',
                                    required: false,
                                    label: 'Излитие околоплодных вод при отсутствии регулярной родовой деятельности'
                                },
                            ]
                        },
                        {
                            name:'gr12-13',
                            type: 'subgraphs',
                            label: 'Индуцированных по показаниям:',
                            colspan:2,
                            sub:[
                                {
                                    name:'gr12',
                                    type: 'number',
                                    required: false,
                                    label: 'со стороны матери (тяжелые ЭГЗ с декомпенсацией, осложнения беременности)'
                                },
                                {
                                    name:'gr13',
                                    type: 'number',
                                    required: false,
                                    label: 'со стороны плода (некурабельные ВПР,  прогрессирующее ухудшение, антенатальная гибель)'
                                },
                            ]
                        },
                    ]

                }

            ]

        },
        {
            name: 'gr14-20',
            type: 'subgraphs',
            label: 'Причины преждевременных родов:',

            colspan:7,
            sub:[
                {
                    name:'gr14',
                    type: 'number',
                    required: false,
                    rowspan:3,
                    label: 'Инфекционные заболевания матери',

                },
                {
                    name:'gr15',
                    type: 'number',
                    required: false,
                    label: 'Экстрагенитальная патология',
                    rowspan:3
                },
                {
                    name:'gr16',
                    type: 'number',
                    required: false,
                    label: 'Осложнения, связанные с беременностью',
                    rowspan:3
                },
                {
                    name:'gr17',
                    type: 'number',
                    required: false,
                    label: 'Изосерологическая несовместимость',
                    rowspan:3
                },
                {
                    name:'gr18',
                    type: 'number',
                    required: false,
                    label: 'Аномалии развития женской половой сферы',
                    rowspan:3
                },
                {
                    name:'gr19',
                    type: 'number',
                    required: false,
                    label: 'ВПР и хромосомные аномалиии',
                    rowspan:3
                },
                {
                    name:'gr20',
                    type: 'number',
                    required: false,
                    label: 'Травматические повреждения',
                    rowspan:3
                },
            ]
        },
        {
            name: 'gr21-24',
            type: 'subgraphs',
            label: 'Срок гестации на момент завершения беременности, нед.:',
            colspan:4,

            sub:[
                {
                    name:'gr21',
                    type: 'number',
                    required: false,
                    label: '22-27 нед.',
                    rowspan:3
                },
                {
                    name:'gr22',
                    type: 'number',
                    required: false,
                    label: '28-30 нед.',
                    rowspan:3
                },
                {
                    name:'gr23',
                    type: 'number',
                    required: false,
                    label: '31-33 нед.',
                    rowspan:3
                },
                {
                    name: 'gr24',
                    type: 'number',
                    required: false,
                    label: '34-37 нед.',
                    rowspan:3
                }
            ]
        },
        {
            name:'gr25',
            type: 'number',
            required: true,
            label: 'Консервативное родоразрешение',
            rowspan:4
        },
        {
            name:'gr26',
            type: 'number',
            required: true,
            label: 'Родоразрешение путем КС',
            rowspan:4
        },
        {
            name: 'gr27-31',
            type: 'subgraphs',
            label: 'Масса новорожденного, гр.:',

            colspan:6,
            sub:[
                {
                    name:'gr27',
                    type: 'number',
                    required: false,
                    label: '500-749',
                    rowspan:3
                },
                {
                    name:'gr28',
                    type: 'number',
                    required: false,
                    label: '750-999',
                    rowspan:3
                },
                {
                    name:'gr29',
                    type: 'number',
                    required: false,
                    label: '1000-1499',
                    rowspan:3
                },
                {
                    name: 'gr30',
                    type: 'number',
                    required: false,
                    label: '1500-1999',
                    rowspan:3
                },
                {
                    name: 'gr31',
                    type: 'number',
                    required: false,
                    label: '2000-2499',
                    rowspan:3
                }
                ,
                {
                    name: 'gr32',
                    type: 'number',
                    required: false,
                    label: '2500 и более',
                    rowspan:3
                }
            ]
        },
        {
            name: 'gr33-35',
            type: 'subgraphs',
            label: 'Перинатальные потери:',

            colspan:3,
            sub:[
                {
                    name:'gr33',
                    type: 'number',
                    required: false,
                    label: 'Антенатальная гибель плода',
                    rowspan:3
                },
                {
                    name:'gr34',
                    type: 'number',
                    required: false,
                    label: 'Интранатальная гибель плода',
                    rowspan:3
                },
                {
                    name:'gr35',
                    type: 'number',
                    required: false,
                    label: 'Умерло в первые 168 часов',
                    rowspan:3
                }
            ]
        },
        {
            name: 'gr36',
            type: 'number',
            required: false,
            label: 'Число рожденные с весом менее 500г.',
            rowspan:4
        }
    ];
});




