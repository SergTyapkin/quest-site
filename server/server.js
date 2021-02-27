'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

const users = {
    'tyapkin': {
        nickname: 'tyapkin',
        email: 'tyapkin2002@mail.ru',
        password: 'password',
        branch: 1,
        progress: 1,
    },
    'sererga': {
        nickname: 'sererga',
        email: 'sererga115@gmail.com',
        password: 'password',
        branch: undefined,
        progress: undefined,
    },
    '.': {
        nickname: '.',
        email: 'nomail@mail.ru',
        password: '.',
        branch: undefined,
        progress: undefined,
    }
};
const nicks = {};

app.post('/register', (req, res) => {
    const nickname = req.body.nickname;
    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    if (!nickname)
        return res.status(400).json({error: 'А чё, а где имя пользователя?'});
    if (!password)
        return res.status(400).json({error: 'А чё, а где пароль?'});
    if (!email)
        return res.status(400).json({error: 'А чё, а где email?'});
    if (!password.match(/^\S{4,}$/))
        return res.status(400).json({error: 'Пароль коротковат, надо хотя бы 4 с̶м̶ символа'});
    if (!email.match(/@/))
        return res.status(400).json({error: 'Не обманывай, email не настоящий.'});

    if (users[nickname])
        return res.status(400).json({error: 'Художественный фильм: "у̶к̶р̶а̶л̶и̶ имя пользователя". (оно занято)'});
    for (const [, userData] of Object.entries(users))
        if (userData.email === email)
            return res.status(400).json({error: 'На этот email уже зарегистрирован пользователь "' + userData.nickname + '"'});

    users[nickname] = {nickname, password, email, branch: undefined, progress: undefined};
    const id = uuid.v4();
    nicks[id] = nickname;

    res.cookie('userId', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).end();
});

app.post('/login', (req, res) => {
    const password = req.body.password;
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({error: 'Тебе не кажется, что чего-то не хватает? (логина)'});
    if (!password)
        return res.status(400).json({error: 'Тебе не кажется, что чего-то не хватает? (пароля)'});
    if (!users[nickname])
        return res.status(400).json({error: 'Такого пользователя нет'});
    if (users[nickname].password !== password)
        return res.status(400).json({error: 'Пароль не подходит'});

    const id = uuid.v4();
    nicks[id] = nickname;

    res.cookie('userId', id, {expires: new Date(Date.now() + 1000 * 3600 * 24)});
    res.status(200).end();
});

app.get('/me', (req, res) => {
    const id = req.cookies['userId'];
    const nickname = nicks[id];
    if (!nickname || !users[nickname])
        return res.status(401).json({error: 'Пользователя ' + nickname + ' нет в базе данных.'});

    res.status(200).json(users[nickname]).end();
});

app.post('/me', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({error: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});

    const prevNickname = nicks[id];
    const prevPassword = users[nicks[id]].password;
    const prevEmail = users[nicks[id]].email;

    const nickname = req.body.nickname;
    const password = req.body.password;
    const email = req.body.email.toLowerCase();

    if (!nickname)
        return res.status(400).json({error: 'Пустое имя пользователя занято оригинальным админом'});
    if (!password)
        return res.status(400).json({error: 'Без пароля никак не обойтись'});
    if (!email)
        return res.status(400).json({error: 'Без email\'а нельзя'});
    if (!password.match(/^\S{4,}$/))
        return res.status(400).json({error: 'Пароль коротковат, надо хотя бы 4 с̶м̶ символа'});
    if (!email.match(/@/))
        return res.status(400).json({error: 'Не обманывай, email не настоящий'});

    if (prevNickname !== nickname && users[nickname])
        return res.status(400).json({error: 'Художественный фильм: "у̶к̶р̶а̶л̶и̶ имя пользователя". (оно занято)'});

    if (prevEmail !== email)
        for (const [, userData] of Object.entries(users))
            if (userData.email === email)
                return res.status(400).json({error: 'На этот email уже зарегистрирован пользователь "' + userData.nickname + '"'});

    if (prevNickname === nickname && prevPassword === password && prevEmail === email)
        return res.status(400).json({error: 'Зачем кнопку теребишь, если не поменял ничего?'});

    eval("delete users[nicks[id]]"); // remove user
    users[nickname] = {nickname, password, email, branch: undefined, progress: undefined}; // create new user
    nicks[id] = nickname;

    res.cookie('userId', id, {expires: new Date(Date.now() + 1000 * 60 * 10)});
    res.status(200).end();
});

const port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});