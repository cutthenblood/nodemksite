var deathmSchema = [
    {
        name:'info',
        type: 'info',
        row:2,
        col:32

    },
    {
        name:'gr2',
        type: 'number',
        required: true,
        label: 'Кол-во умерших от БСК всего',
        rowspan:2

    },
    {
        name:'gr3-5',
        type: 'subgraphs',
        label: 'Из них',
        colspan:3,
        sub: [
            {
                name:'gr3',
                type: 'number',
                required: true,
                label: 'в стационаре'

            },
            {
                name:'gr4',
                type: 'number',
                required: true,
                label: 'на дому'

            },
            {
                name:'gr5',
                type: 'number',
                required: true,
                label: 'в др. местах'

            }

        ]
    },
    {
        name:'gr6-7',
        type: 'subgraphs',
        label: 'Из них',
        colspan:2,
        sub: [
            {
                name:'gr6',
                type: 'number',
                required: true,
                label: 'вскрыто ПАО'

            },
            {
                name:'gr7',
                type: 'number',
                required: true,
                label: 'без вскрытия'

            }
        ]
    },
    {
        name:'gr8-19',
        type: 'subgraphs',
        label: 'Первоначальная причина смерти, указанная в заключении патологоанатома',
        colspan:12,
        sub: [
            {
                name:'gr8',
                type: 'number',
                required: true,
                label: 'Хр.ревматические болезни сердца',
                tip:'I 05_I 09'

            },
            {
                name:'gr9',
                type: 'number',
                required: true,
                label: 'Артериальные гипертензии',
                tip:'I 10_I 15'

            },
            {
                name:'gr10',
                type: 'number',
                required: true,
                label: 'ИБС',
                tip:'I 20_I 25'

            },
            {
                name:'gr11',
                type: 'number',
                required: true,
                label: 'Стенокардии',
                tip:'I 20.0- 20.9'

            },
            {
                name:'gr12',
                type: 'number',
                required: true,
                label: 'Инфаркт миокарда',
                tip:'I 21_I 22'

            },
            {
                name:'gr13',
                type: 'number',
                required: true,
                label: 'Атеросклеротическая болезнь сердца',
                tip:'I 25.1, I 25.3'

            },
            {
                name:'gr14',
                type: 'number',
                required: true,
                label: 'Тромбоэмболия',
                tip:'I 26'

            },
            {
                name:'gr15',
                type: 'number',
                required: true,
                label: 'Другие болезни сердца',
                tip:'I 30_I 49'

            },
            {
                name:'gr16',
                type: 'number',
                required: true,
                label: 'Сердечная недостаточность',
                tip:'I 50-I 59'

            },
            {
                name:'gr17',
                type: 'number',
                required: true,
                label: 'ЦВБ',
                tip:'I 60_I 69'

            },
            {
                name:'gr18',
                type: 'number',
                required: true,
                label: 'Инсульты',
                tip:'I 60-I 64'

            },
            {
                name:'gr19',
                type: 'number',
                required: true,
                label: 'Прочие',
                tip:'I 70- I99'

            }
        ]
    },
    {
        name:'gr20-31',
        type: 'subgraphs',
        label: 'Первоначальная причина смерти, указанная в заключении патологоанатома',
        colspan:12,
        sub: [
            {
                name:'gr20',
                type: 'number',
                required: true,
                label: 'Хр.ревматические болезни сердца',
                tip:'I 05_I 09'

            },
            {
                name:'gr21',
                type: 'number',
                required: true,
                label: 'Артериальные гипертензии',
                tip:'I 10_I 15'

            },
            {
                name:'gr22',
                type: 'number',
                required: true,
                label: 'ИБС',
                tip:'I 20_I 25'

            },
            {
                name:'gr23',
                type: 'number',
                required: true,
                label: 'Стенокардии',
                tip:'I 20.0- 20.9'

            },
            {
                name:'gr24',
                type: 'number',
                required: true,
                label: 'Инфаркт миокарда',
                tip:'I 21_I 22'

            },
            {
                name:'gr25',
                type: 'number',
                required: true,
                label: 'Атеросклеротическая болезнь сердца',
                tip:'I 25.1, I 25.3'

            },
            {
                name:'gr26',
                type: 'number',
                required: true,
                label: 'Тромбоэмболия',
                tip:'I 26'

            },
            {
                name:'gr27',
                type: 'number',
                required: true,
                label: 'Другие болезни сердца',
                tip:'I 30_I 49'

            },
            {
                name:'gr28',
                type: 'number',
                required: true,
                label: 'Сердечная недостаточность',
                tip:'I 50-I 59'

            },
            {
                name:'gr29',
                type: 'number',
                required: true,
                label: 'ЦВБ',
                tip:'I 60_I 69'

            },
            {
                name:'gr30',
                type: 'number',
                required: true,
                label: 'Инсульты',
                tip:'I 60-I 64'

            },
            {
                name:'gr31',
                type: 'number',
                required: true,
                label: 'Прочие',
                tip:'I 70- I99'

            }
        ]
    },
    {
        name:'gr32',
        type: 'number',
        required: true,
        label: 'R 54',
        rowspan:2

    },
    {
        name:'gr33',
        type: 'number',
        required: true,
        label: 'Введено в Парус сведетельств, умерших от БСК',
        rowspan:2

    }
    ];
