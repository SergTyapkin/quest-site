'use strict';

const bumonka1 = require("./quests/8 марта. Бауманка РК6-41Б.js");
const bumonka3 = require("./quests/8 марта. Бауманка РК6-43Б.js");
const bumonka4 = require("./quests/8 марта. Бауманка РК6-44Б.js");
const bumonka5 = require("./quests/8 марта. Бауманка РК6-45Б.js");
const bumonka6 = require("./quests/8 марта. Бауманка РК6-46Б.js");

const express = require('express');
//const https = require( "https" ); // для организации https
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
    bumonka1.quest,
    bumonka3.quest,
    bumonka4.quest,
    bumonka5.quest,
    bumonka6.quest,
];

const users = {"123":{"nickname":"123","password":"qazw","email":"andrew.khmel@gmail.com","progress":0,"rating":0,"isFoundBonus":false,"admin":false},"TyapkinS":{"nickname":"TyapkinS","email":"sererga115@gmail.com","password":"password","quest":"0","branch":"0","progress":0,"rating":305,"isFoundBonus":false,"admin":true},"cezarus":{"nickname":"cezarus","password":"1234","email":"cezarus1337@gmail.com","quest":"0","branch":"2","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"dishulka":{"nickname":"dishulka","password":"dish0311","email":"dishulka@mail.ru","quest":"4","branch":"2","progress":1,"rating":4,"isFoundBonus":false,"admin":false},"alsh":{"nickname":"alsh","password":"Qwerty1941","email":"alinashikova5@gmail.com","quest":"2","branch":"0","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"TyapkinSergey":{"nickname":"TyapkinSergey","password":"password","email":"tyapkin2002@mail.ru","quest":"0","branch":"1","progress":0,"rating":0,"isFoundBonus":false,"admin":false},"Reflect_doll":{"nickname":"Reflect_doll","password":"Ljxtymrf2001","email":"animeshka-78@mail.ru","quest":"0","branch":"2","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"Pompudi":{"nickname":"Pompudi","password":"56rofipe","email":"milena28112001@gmail.com","quest":"3","branch":"1","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"mileno4ka":{"nickname":"mileno4ka","password":"2x2budethui","email":"mmileno4ka4@gmail.com","quest":"2","branch":"1","progress":2,"rating":2,"isFoundBonus":false,"admin":false},"zorkostreis":{"nickname":"zorkostreis","password":"uzaguf65","email":"zorkostreis@gmail.com","quest":"2","branch":"1","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"Olga_Golovleva":{"nickname":"Olga_Golovleva","password":"cfwp4505","email":"golowleva.ol@yandex.ru","quest":"3","branch":"2","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"love_bmstu":{"nickname":"love_bmstu","password":"beer","email":"polina.kychakova@outlook.com","quest":"4","branch":"1","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"Crybaby":{"nickname":"Crybaby","password":"daradarkness","email":"lostdoff@yandex.ru","quest":"1","branch":"1","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"yuimarvel":{"nickname":"yuimarvel","password":"Asdfg123","email":"yuimarvel@icloud.com","quest":"1","branch":"0","progress":0,"rating":1,"isFoundBonus":false,"admin":false},"DaschaM":{"nickname":"DaschaM","password":"Darena2001","email":"m2643870@ya.ru","quest":"1","branch":"0","progress":1,"rating":1,"isFoundBonus":false,"admin":false},"Sanchez":{"nickname":"Sanchez","password":"qwertyuiop","email":"erofeev.alex1337@yandex.ru","progress":0,"rating":0,"isFoundBonus":false,"admin":false},"Danya":{"nickname":"Danya","password":"qwerty","email":"seryoga@dayadmina.ru","progress":0,"rating":0,"isFoundBonus":false,"admin":true},"Mary2":{"nickname":"Mary2","password":"12345","email":"a@g.m","progress":0,"rating":0,"isFoundBonus":false,"admin":false},"mikkelyangelo":{"nickname":"mikkelyangelo","password":"Restart1","email":"michailmudr@mail.ru","progress":0,"rating":0,"isFoundBonus":false,"admin":true},"kirill":{"nickname":"kirill","password":"1111","email":"dnr407@yandex.ru","quest":"1","branch":"0","progress":0,"rating":0,"isFoundBonus":false,"admin":false},"Wolf":{"nickname":"Wolf","password":"qwer123","email":"wolf@wolf.wolf","progress":0,"rating":0,"isFoundBonus":false,"admin":false},"Shadina":{"nickname":"Shadina","password":"s260701d","email":"shabalina_diana@mail.ru","quest":"2","branch":"0","progress":1,"rating":1,"isFoundBonus":false,"admin":false}};
const nicks = {};


app.get('/api/play', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({answerError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    const user = users[nicks[id]];

    if ((typeof user.quest === "undefined") || (typeof user.branch === "undefined"))
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
    user.rating += 1;
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

app.post('/api/quest', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({answerError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    const user = users[nicks[id]];

    user.quest = req.body.questId;
    user.branch = req.body.branchId;
    user.progress = 0;
    user.isFoundBonus = false;

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
    if (nickname.length > 16)
        return res.status(400).json({nicknameError: 'Уложи свой полёт фантазии в 16 символов пж'});
    if (password.length > 30)
        return res.status(400).json({passwordError: 'Длинновато. Больше 30 символов не влезет'});
    if (email.length > 30)
        return res.status(400).json({emailError: 'Длинновато. Больше 30 символов не влезет'});
    if (password.length < 4)
        return res.status(400).json({passwordError: 'Пароль коротковат, надо хотя бы 4 с̶м̶ символа'});
    if (!email.match(/@/))
        return res.status(400).json({emailError: 'Не обманывай, email не настоящий.'});

    if (users[nickname])
        return res.status(400).json({nicknameError: 'Художественный фильм: "у̶к̶р̶а̶л̶и̶ имя пользователя". (оно занято)'});
    for (const [, userData] of Object.entries(users))
        if (userData.email === email)
            return res.status(400).json({emailError: 'На этот email уже зарегистрирован пользователь "' + userData.nickname + '"'});

    users[nickname] = {nickname, password, email, quest: undefined, branch: undefined, progress: 0, rating: 0, isFoundBonus: false, admin: false,};
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
        return res.status(401).json({error: 'Пользователя ' + nickname + ' нет.'});

    const user = {};
    Object.assign(user, users[nickname]);
    delete user.password;
    if ((typeof user.quest !== "undefined") && (typeof user.branch !== "undefined"))
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
    if (nickname.length > 16)
        return res.status(400).json({nicknameError: 'Уложи свой полёт фантазии в 16 символов пж'});
    if (email.length > 30)
        return res.status(400).json({emailError: 'Длинновато. Больше 30 символов не влезет'});
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
    users[nickname] = {nickname, prevPassword, email, quest: undefined, branch: undefined, progress: 0, rating: 0, isFoundBonus: false, admin: false,}; // create new user
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
    if (newPassword.length > 30)
        return res.status(400).json({newPasswordError: 'Длинновато. Больше 30 символов не влезет'});
    if (newPassword.length < 4)
        return res.status(400).json({newPasswordError: 'Пароль коротковат, надо хотя бы 4 с̶м̶ символа'});

    if (newPassword === password)
        return res.status(400).json({passwordError: 'Пароли совпадают. (Шо то - фигня, шо то - фигня)', newPasswordError: ''});

    users[nicks[id]].password = newPassword;

    res.status(200).end();
});

app.get('/api/rating', (req, res) => {
    const rates = [];
    for (const [, userData] of Object.entries(users)) {
        rates.push({nickname: userData.nickname, rating: userData.progress, isFoundBonus: userData.isFoundBonus}); // ----------- !!! PROGRESS BUT NOT RATING !!! ------------
    }
    rates.sort((a, b) => {
        return b.rating - a.rating;
    });
    res.status(200).json({users: rates}).end();
});


app.get('/api/quest_bonuspage', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(401).json({error: 'Бонус-страница недоступна, ведь ты не авторизован'});
    const user = users[nicks[id]];

    if ((typeof user.quest === "undefined") || (typeof user.branch === "undefined"))
        return res.status(400).json({error: 'Бонус-страница недоступна, ведь не выбрана ветка'});

    if (user.progress + 1 < quests[user.quest].branches[user.branch].tasks.length)
        return res.status(400).json({error: 'Бонус-страница недоступна, ведь ветка ещё не пройдена до конца'});

    user.isFoundBonus = true;
    res.status(200).json(quests[user.quest].branches[user.branch].bonus).end();
});




app.get('/api/admin', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Не авторизован или сессия устарела. В доступе отказано'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Ты не админ. Таким сюда низя. В доступе отказано'});

    res.status(200).end();
});

app.post('/api/admin/user', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Ты не админ. Таким сюда низя'});

    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});

    res.status(200).json(users[req.body.nickname]).end();
});

app.get('/api/admin/users', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    res.status(200).json(users).end();
});

app.get('/api/admin/quests', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    res.status(200).json(quests).end();
});

app.post('/api/admin/set-quest', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    const quest = req.body.quest;
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!quest)
        return res.status(400).json({questError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});
    if (typeof quests[quest] === "undefined")
        return res.status(400).json({questError: 'Недопустимое значение'});

    users[nickname].quest = parseInt(quest);
    res.status(200).end();
});

app.post('/api/admin/set-branch', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    const branch = req.body.branch;
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!branch)
        return res.status(400).json({branchError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});
    if ((typeof users[nickname].quest === "undefined"))
        return res.status(400).json({nicknameError: 'Пользователь не выбрал квест'});
    if (typeof quests[users[nickname].quest].branches[branch] === "undefined")
        return res.status(400).json({branchError: 'Недопустимое значение'});

    users[nickname].branch = parseInt(branch);
    res.status(200).end();
});

app.post('/api/admin/set-progress', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    const progress = req.body.progress;
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!progress)
        return res.status(400).json({progressError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});
    if ((typeof users[nickname].quest === "undefined") || (typeof users[nickname].branch === "undefined"))
        return res.status(400).json({nicknameError: 'Пользователь не выбрал ветку'});
    if ((progress < 0) || (progress > quests[users[nickname].quest].branches[users[nickname].branch].tasks.length))
        return res.status(400).json({progressError: 'Недопустимое значение'});

    users[nickname].progress = parseInt(progress);
    res.status(200).end();
});

app.post('/api/admin/set-isfoundbonus', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    const isFoundBonus = req.body.isFoundBonus.toLowerCase();
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!isFoundBonus)
        return res.status(400).json({isFoundBonusError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});
    if ((isFoundBonus !== 'true') && (isFoundBonus !== 'false'))
        return res.status(400).json({isFoundBonusError: 'Недопустимое значение'});

    users[nickname].isFoundBonus = (isFoundBonus === 'true');
    res.status(200).end();
});

app.post('/api/admin/set-admin', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    const admin = req.body.admin.toLowerCase();
    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!admin)
        return res.status(400).json({adminError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});
    if ((admin !== 'true') && (admin !== 'false'))
        return res.status(400).json({adminError: 'Недопустимое значение'});

    users[nickname].admin = (admin === 'true');
    res.status(200).end();
});

app.post('/api/admin/delete-user', (req, res) => {
    const id = req.cookies['userId'];
    if (!(id in nicks))
        return res.status(400).json({nicknameError: 'Сессия устарела, и ты теперь не вошёл в аккаунт.'});
    if (!users[nicks[id]].admin)
        return res.status(400).json({nicknameError: 'Вы не админ. Таким сюда низя'});

    const nickname = req.body.nickname;
    if (!nickname)
        return res.status(400).json({nicknameError: 'Тебе не кажется, что чего-то не хватает?'});
    if (!users[nickname])
        return res.status(400).json({nicknameError: 'Такого пользователя нет'});

    delete users[nickname];
    res.status(200).end();
});


app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/*', (req, res) => {
    fs.readFile(path.resolve(__dirname, '..', 'public', 'redirect.html'), (err, data) => {
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

app.listen(port, () => {
    console.log(`Server listening port ${port}`);
});

/*const httpsOptions = {
    key: fs.readFileSync("server.key"), // путь к ключу
    cert: fs.readFileSync("server.crt") // путь к сертификату
}*/

//http.createServer(app).listen(8000);