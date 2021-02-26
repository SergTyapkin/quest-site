export const html = `
<div class="left-item" style="padding: 20px">
    <div class="title-big">КУДА ТЫ ПОПАЛ?</div>
    <div class="text"><span class="text-big">Здесь</span> ты сможешь найти <span class="text-big">онлайн-квест</span> по душе, созданный нашими професси<span style="font-style: italic">онал</span>ами.</div>
</div>
<div class="right-item" style="padding: 20px">
    <div class="title">ЭТО ХОТЬ БЕСПЛАТНО?</div>
    <div class="text">Всё <span class="text-big">бесплатно</span> <span style="text-decoration: line-through">пока что</span>.</div>
</div>
<div class="left-item" style="padding: 20px">
    <div class="title-big">КАК ПОЛЬЗОВАТЬСЯ?</div>
    <div class="text-big">Смотри, всё просто:
        <div style="padding-left: 10px">
            <li class="text">регистрируешься</li>
            <li class="text">выбираешь квест и ветку</li> 
            <li class="text">чем больше проходишь - тем выше ты в рейтинге</li>
        </div>
    </div>
</div>
<div class="right-item" style="padding: 20px">
    <div class="title">У МЕНЯ ОСТАЛИСЬ ВОПРОСЫ</div>
    <div class="text">Там снизу есть <span class="text-big">контакты</span> - пиши, не стестняйся.</div>
</div>
<div style="position: relative; text-align: center; margin: 30px">
    <linkButton class="submit light" href="/register">Регистрация</linkButton>
</div>

<ul class="underbar-contacts">
    <!--div><li style="padding: 0px 0 0px 10px">
        <span>Контакты</span>
    </li></div-->
    <li>
        <div class="title" style="font-size: 18px; font-family: Arial">E-mail:</div>
        <div style="text-shadow: 0 0 8px #ba9b87">Tyapkin2002@mail.ru</div>
    </li>
    <li>
        <div class="title" style="font-size: 18px; font-family: Arial">VK: <span style="font-size: 8px">(лучше сюда)</span> </div>
        <div><a href="https://vk.com/0pointer" style="color: inherit; text-shadow: 0 0 8px #baa190">vk.com/0pointer</a></div>
    </li>
    <li>
        <div class="title" style="font-size: 18px; font-family: Arial">Telegram:</div>
        <div><a href="https://t.me/tyapkin_s" style="color: inherit; text-shadow: 0 0 8px #c3a38e">t.me/tyapkin_s</a></div>
    </li>
</ul>
`;

export function source(element, router) {
    document.title = "О нас";
    element.innerHTML = html;
}