export const html = `
<div class="title-big">Куда ты попал?</div>
<div class="text"><span class="text-big>"Здесь</span> ты сможешь найти <span class="text-big">квест</span> по душе, созданный нашими профессионалами</div>
<div class="title">"Shut up and take my money"</div>
<div class="text">Всё <span class="text-big">бесплатно</span> <span style="font-style: italic">пока что</span></div>

<ul class="underbar-contacts">
    <li>
        <div class="text-big">E-mail:</div>
        <div class="text">Tyapkin2002@mail.ru</div>
    </li>
    <li>
        <div class="text-big">VK:</div>
        <div class="text"><a href="https://vk.com/0pointer">vk.com/0pointer</a></div>
    </li>
    <li>
        <div class="text-big">Telegram:</div>
        <div class="text"><a href="https://t.me/tyapkin_s">t.me/tyapkin_s</a></div>
    </li>
</ul>
`;

export function source(element, router) {
    document.title = "Квест";
    element.innerHTML = html;
}