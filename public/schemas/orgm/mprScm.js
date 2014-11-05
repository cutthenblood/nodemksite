var mprSchema = [

    {
        name:'gr5',
            type: 'number',
            required: true,
            label: 'Родов всего'
            },
    {
            name:'gr6-13',
            type: 'subgraphs',
            label: 'Из низ преждевременных родов:',
            sub: [
                    {
                        name:'gr6',
                        type: 'number',
                        required: false,
                        label: 'абс.'
                    },{
                    name:'gr8',
                    type: 'number',
                    required: false,
                    label: ' Многоплодных'
                },{
                    name:'gr9-13',
                    type: 'subgraphs',
                    label: ' В том числе:',
                    sub:[
                        {
                            name:'gr9',
                            type: 'number',
                            required: false,
                            label: 'В том числе, у находящихся на лечении в ЛПМО более 24 часов'
                        },
                        {
                            name:'gr10-11',
                            type: 'subgraphs',
                            label: 'Спонтанных:',
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
        sub:[
            {
                name:'gr14',
                type: 'number',
                required: false,
                label: 'Инфекционные заболевания матери'
            },
            {
                name:'gr15',
                type: 'number',
                required: false,
                label: 'Экстрагенитальная патология'
            },
            {
                name:'gr16',
                type: 'number',
                required: false,
                label: 'Осложнения, связанные с беременностью'
            },
            {
                name:'gr17',
                type: 'number',
                required: false,
                label: 'Изосерологическая несовместимость'
            },
            {
                name:'gr18',
                type: 'number',
                required: false,
                label: 'Аномалии развития женской половой сферы'
            },
            {
                name:'gr19',
                type: 'number',
                required: false,
                label: 'ВПР и хромосомные аномалиии'
            },
            {
                name:'gr20',
                type: 'number',
                required: false,
                label: 'Травматические повреждения'
            },
        ]
    },
    {
        name: 'gr21-24',
        type: 'subgraphs',
        label: 'Срок гестации на момент завершения беременности, нед.:',
        sub:[
            {
                name:'gr21',
                type: 'number',
                required: false,
                label: '22-27 нед.'
            },
            {
                name:'gr22',
                type: 'number',
                required: false,
                label: '28-30 нед.'
            },
            {
                name:'gr23',
                type: 'number',
                required: false,
                label: '31-33 нед.'
            },
            {
                name: 'gr24',
                type: 'number',
                required: false,
                label: '34-37 нед.'
            }
        ]
    },
    {
        name:'gr25',
        type: 'number',
        required: true,
        label: 'Консервативное родоразрешение'
    },
    {
        name:'gr26',
        type: 'number',
        required: true,
        label: 'Родоразрешение путем КС'
    },
    {
        name: 'gr27-31',
        type: 'subgraphs',
        label: 'Масса новорожденного, гр.:',
        sub:[
            {
                name:'gr27',
                type: 'number',
                required: false,
                label: '500-749'
            },
            {
                name:'gr28',
                type: 'number',
                required: false,
                label: '750-999'
            },
            {
                name:'gr29',
                type: 'number',
                required: false,
                label: '1000-1499'
            },
            {
                name: 'gr30',
                type: 'number',
                required: false,
                label: '1500-1999'
            },
            {
                name: 'gr31',
                type: 'number',
                required: false,
                label: '2000-2499'
            }
            ,
            {
                name: 'gr32',
                type: 'number',
                required: false,
                label: '2500 и более'
            }
        ]
    },
    {
        name: 'gr33-35',
        type: 'subgraphs',
        label: 'Перинатальные потери:',
        sub:[
            {
                name:'gr33',
                type: 'number',
                required: false,
                label: 'Антенатальная гибель плода'
            },
            {
                name:'gr34',
                type: 'number',
                required: false,
                label: 'Интранатальная гибель плода'
            },
            {
                name:'gr35',
                type: 'number',
                required: false,
                label: 'Умерло в первые 168 часов'
            }
        ]
    }
];
