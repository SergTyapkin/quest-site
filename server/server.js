'use strict';

const bumonka = require("./quests/8 марта. Бауманка.js");
const testQuest = require("./quests/Тестовый квест.js");

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(morgan('dev'));
app.use(body.json());
app.use(cookie());


const quests = [
    bumonka.quest,
    testQuest.quest,
];

const users = {
    'Sergey': {
        nickname: 'Sergey',
        email: 'tyapkin2002@mail.ru',
        password: 'password',
        quest: undefined,
        branch: undefined,
        progress: 0,
        rating: 0,
    },
    'TyapkinS': {
        nickname: 'TyapkinS',
        email: 'sererga115@gmail.com',
        password: 'password',
        quest: undefined,
        branch: undefined,
        progress: 0,
        rating: 0,
    },
    '.': {
        nickname: '.',
        email: 'nomail@mail.ru',
        password: '.',
        quest: 0,
        branch: 0,
        progress: 0,
        rating: 100,
    },
};
const nicks = {};

app.get('/api/play', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({answerError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    const user = users[nicks[id]];
    console.log(user);

    if (typeof user.quest === "undefined" || typeof user.branch === "undefined")
        return res.status(401).json({answerError: 'Квест не выбран.'});

    const branch = quests[user.quest].branches[user.branch];
    const task = {};
    if (user.progress === branch.tasks.length)
        Object.assign(task, branch.final);
    else
        Object.assign(task, branch.tasks[user.progress]);
    delete task.answers;

    task.questTitle = quests[user.quest].title;
    task.branchTitle = quests[user.quest].branches[user.branch].title;

    task.progress = user.progress;
    task.len = branch.tasks.length;
    res.status(200).json(task);
});

app.post('/api/play', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({answerError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    const user = users[nicks[id]];

    if (quests[user.quest].branches[user.branch].tasks[user.progress].answers.indexOf(req.body.answer.toLowerCase()) === -1)
        return res.status(400).json({answerError: 'Ответ неверный'});

    user.progress += 1;
    res.status(200).end();
});

app.get('/api/quest', (req, res) => {
    const questTitles = [];
    for (const quest of quests)
        questTitles.push(quest.title)

    res.status(200).json(questTitles);
});

app.post('/api/branch', (req, res) => {
    const branches = [];
    for (const branch of quests[req.body.questId].branches)
        branches.push({title: branch.title, description: branch.description});

    res.status(200).json(branches);
});

app.post('/api/quests', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({answerError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    const user = users[nicks[id]];

    user.quest = req.body.questId;
    user.branch = req.body.branchId;
    user.progress = 0;

    console.log(user);

    res.status(200).end();
});

app.post('/api/register', (req, res) => {
    const nickname = req.body.nickname;
    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    if (!nickname)
        return res.status(400).json({nicknameError: 'А чё, а где имя пользователя?'});
    if (!password)
        return res.status(400).json({passwordError: 'А чё, а где пароль?'});
    if (!email)
        return res.status(400).json({emailError: 'А чё, а где email?'});
    if (!password.match(/^\S{4,}$/))
        return res.status(400).json({passwordError: 'Пароль коротковат, надо хотя бы 4 с̶м̶ символа'});
    if (!email.match(/@/))
        return res.status(400).json({emailError: 'Не обманывай, email не настоящий.'});

    if (users[nickname])
        return res.status(400).json({nicknameError: 'Художественный фильм: "у̶к̶р̶а̶л̶и̶ имя пользователя". (оно занято)'});
    for (const [, userData] of Object.entries(users))
        if (userData.email === email)
            return res.status(400).json({emailError: 'На этот email уже зарегистрирован пользователь "' + userData.nickname + '"'});

    users[nickname] = {nickname, password, email, branch: undefined, progress: 0};
    const id = uuid.v4();
    nicks[id] = nickname;

    res.cookie('userId', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).end();
});

app.post('/api/login', (req, res) => {
    const password = req.body.password;
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!password)
        return res.status(400).json({passwordError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});
    if (users[nickname].password !== password)
        return res.status(400).json({passwordError: 'Пароль не подходит'});

    const id = uuid.v4();
    nicks[id] = nickname;

    res.cookie('userId', id, {expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)}); // on week
    res.status(200).end();
});

app.get('/api/me', (req, res) => {
    const id = req.cookies['userId'];
    const nickname = nicks[id];
    if (!nickname || !users[nickname])
        return res.status(401).json({error: 'Пользователя ' + nickname + ' нет в базе данных.'});

    const user = {};
    Object.assign(user, users[nickname]);
    delete user.password;
    if (typeof user.quest !== "undefined" && typeof user.branch !== "undefined")
        user.len = quests[user.quest].branches[user.branch].tasks.length;

    res.status(200).json(user).end();
});

app.post('/api/me/change-data', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});

    const prevNickname = nicks[id];
    const prevEmail = users[nicks[id]].email;
    const prevPassword = users[nicks[id]].password;

    const nickname = req.body.nickname;
    const email = req.body.email.toLowerCase();

    if (!nickname)
        return res.status(400).json({nicknameError: 'Пустое имя пользователя занято оригинальным админом'});
    if (!email)
        return res.status(400).json({emailError: 'Без email\'а нельзя'});
    if (!email.match(/@/))
        return res.status(400).json({emailError: 'Не обманывай, email не настоящий'});

    if (prevNickname !== nickname && users[nickname])
        return res.status(400).json({nicknameError: 'Художественный фильм: "у̶к̶р̶а̶л̶и̶ имя пользователя". (оно занято)'});

    if (prevEmail !== email)
        for (const [, userData] of Object.entries(users))
            if (userData.email === email)
                return res.status(400).json({emailError: 'На этот email уже зарегистрирован пользователь "' + userData.nickname + '"'});

    if (prevNickname === nickname && prevEmail === email)
        return res.status(400).json({nicknameError: 'Зачем кнопку теребишь, если не поменял ничего?', emailError: ''});

    delete users[nicks[id]];
    users[nickname] = {nickname, prevPassword, email, branch: undefined, progress: 0}; // create new user
    nicks[id] = nickname;

    res.cookie('userId', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).end();
});

app.post('/api/me/check-password', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({passwordError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});

    const password = req.body.password;

    if (users[nicks[id]].password !== password)
        return res.status(400).json({passwordError: 'Пароль не подходит'});

    res.status(200).end();
});

app.post('/api/me/change-password', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});

    const password = req.body.password;
    const newPassword = req.body.newPassword;

    if (users[nicks[id]].password !== password)
        return res.status(400).json({passwordError: 'Пароль не подходит'});

    if (!newPassword)
        return res.status(400).json({newPasswordError: 'Без пароля нельзя'});
    if (!newPassword.match(/^\S{4,}$/))
        return res.status(400).json({newPasswordError: 'Пароль коротковат, надо хотя бы 4 с̶м̶ символа'});

    if (newPassword === password)
        return res.status(400).json({passwordError: 'Пароли совпадают. (Шо то - фигня, шо то - фигня)', newPasswordError: ''});

    users[nicks[id]].password = newPassword;

    res.status(200).end();
});

app.get('/api/users', (req, res) => {
    res.status(200).json(users).end();
});

app.get('/api/quests', (req, res) => {
    res.status(200).json(quests).end();
});

app.get('/redirect.js', (req, res) => {
    console.log("REDIRECT");
    fs.readFile(__dirname.slice(0, -6) +  '\\public\\redirect.js', (err, data) => {
        data = data.toString();
        data += '\n router.goto(' + req.baseUrl.toString() + '); \n';

        console.log(data);
        console.log('BaseUrl: ' + req.baseUrl);
        res.type('application/javascript; charset=UTF-8');
        res.send(data);
    });
});

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/*', (req, res) => {
    fs.readFile(__dirname.slice(0, -6) +  '\\public\\redirect.html', (err, data) => {
        data = data.toString();
        data += '    router.goto("' + req.originalUrl + '");\n' +
            '</script>\n' +
            '</body>\n' +
            '</html>'

        res.type('text/html; charset=UTF-8');
        res.send(data);
    });
});

const port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});