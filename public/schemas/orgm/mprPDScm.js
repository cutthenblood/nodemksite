var mprPDSchema = [


    {
            name:'gr4-6',
            type: 'subgraphs',
            label: 'I триместр',
            sub: [
                    {
                        name:'gr4',
                        type: 'number',
                        required: false,
                        label: 'Количество беременных вставших на учет в I триместре'
                    },{
                    name:'gr5-6',
                    type: 'subgraphs',
                    label: ' Количество беременных, прошедших скрининг',
                    sub:[
                        {
                            name:'gr5',
                            type: 'number',
                            required: false,
                            label: 'Абс.'
                        },
                        /*{
                            name:'gr6',
                            type: 'number',
                            required: false,
                            label: '%'
                        }*/
                         ]

                }

            ]

         },
    {
        name:'gr7-9',
        type: 'subgraphs',
        label: 'II триместр',
        sub: [
            {
                name:'gr7',
                type: 'number',
                required: false,
                label: 'Количество беременных вставших на учет в II триместре'
            },{
                name:'gr8-9',
                type: 'subgraphs',
                label: ' Количество беременных, прошедших скрининг',
                sub:[
                    {
                        name:'gr8',
                        type: 'number',
                        required: false,
                        label: 'Абс.'
                    },
                    /*{
                        name:'gr9',
                        type: 'number',
                        required: false,
                        label: '%'
                    }*/
                ]

            }

        ]

    },
    {
        name:'gr10-12',
        type: 'subgraphs',
        label: 'III триместр',
        sub: [
            {
                name:'gr10',
                type: 'number',
                required: false,
                label: 'Количество беременных вставших на учет в III триместре'
            },{
                name:'gr11-12',
                type: 'subgraphs',
                label: ' Количество беременных, прошедших скрининг',
                sub:[
                    {
                        name:'gr11',
                        type: 'number',
                        required: false,
                        label: 'Абс.'
                    },
                    /*{
                        name:'gr12',
                        type: 'number',
                        required: false,
                        label: '%'
                    }*/
                ]

            }

        ]

    },
    {
        name:'gr13',
        type: 'number',
        required: false,
        label: 'Общее количество беременных, вставших на учет'
    },
    {
        name:'gr14-15',
        type: 'subgraphs',
        label: ' Количество беременных, прошедших скрининг',
        sub:[
            {
                name:'gr14',
                type: 'number',
                required: false,
                label: 'Абс.'
            },
           /* {
                name:'gr15',
                type: 'number',
                required: false,
                label: '%'
            }*/
        ]

    },
    {
        name:'gr16',
        type: 'number',
        required: false,
        label: 'Количество беременных, не прошедших скрининг'
    },
    {
        name:'gr17',
        type: 'number',
        required: false,
        label: 'Количество беременных,  прошедших скрининг несвоевременно'
    }


];
