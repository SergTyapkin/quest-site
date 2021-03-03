const quest = {
    title: 'Тестовый квест',
        description: 'Только для теста кнопочек',
    branches: [
        {
            title: 'Ветка #1',
            description: '',
            tasks: [
                {
                    title: 'Не вопрос, а ВОПРОСИЩЕ',
                    description: 'Очень сложный <br> вопроc',
                    question: 'Хто я?',
                    answers: [
                        'ans1', 'ans2', 'ans5',
                    ],
                },
                {
                    title: 'Пфф, фигня вопрос',
                    description: 'Ваще изи',
                    question: 'В чем смысл?',
                    answers: [
                        'no', 'yes',
                    ],
                },
            ],
            final: {
                title: 'Ты молодец',
                description: 'Очень хороший человек',
            },
        },
        {
            title: 'Ветка #2',
            description: 'С описанием',
            tasks: [
            ],
            final: {
                title: 'Ты молодец',
                description: 'Очень хороший человек',
            },
        },
        {
            title: 'Ветка #3',
            description: 'Ну тоже типа с описанием',
            tasks: [
            ],
            final: {
                title: 'Ты молодец',
                description: 'Очень хороший человек',
            },
        },
    ],
};

module.exports.quest = quest;