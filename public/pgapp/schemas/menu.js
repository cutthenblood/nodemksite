define(function () {


   return {
        user:{
            kadry:
                [{name:'Мониторинг по "Эффективным контрактам"',href:'kadry'}],
                    orgm:
            [
                {name:'Ежедневный мониторинг смертности от болезней системы кровообращения',href:'deathm'},
                {name:'divider'},
                {name:'Mониторинг преждевременных родов',href:'mpr'},
                {name:'Mониторинг мероприятий по пренатальной диагностике',href:'mprPD'},
                {name:'menuelem',href:'check',text:'Проверить внесенные данные'}

            ],
                mlo:[
                {name:'Мониторинг обеспеченности детского населения',href:'mloDn'},
                {name:'menuelem',href:'check',text:'Проверить внесенные данные'}

            ]
        },
        admin:{
            kady:[
                {name:'Мониторинги',href:'admin'},
                {name:'Настройки',href:'settings'}
            ],
            orgm:[
                {name:'Мониторинги',href:'admin'},
                {name:'Настройки',href:'settings'}
            ],
            mlo:[
                {name:'Мониторинги',href:'admin'},
                {name:'Настройки',href:'settings'}
            ]
        }


    }

/*    return {
        kadry:
            [{name:'Мониторинг по "Эффективным контрактам"',href:'kadry'}],
        orgm:
        [
            {name:'Ежедневный мониторинг смертности от болезней системы кровообращения',href:'deathm'},
            {name:'divider'},
            {name:'Mониторинг преждевременных родов',href:'mpr'},
            {name:'Mониторинг мероприятий по пренатальной диагностике',href:'mprPD'},
            {name:'menuelem',href:'check',text:'Проверить внесенные данные'}

        ],
        mlo:[
            {name:'Мониторинг обеспеченности детского населения',href:'mloDn'},
            {name:'menuelem',href:'check',text:'Проверить внесенные данные'}

        ],
        admin:[
            {name:'Мониторинги',href:'admin'},
            {name:'Настройки',href:'settings'}
        ]

    }*/
});