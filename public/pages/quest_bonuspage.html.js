import {ajax} from "./../ajax.js";

const html = `
<div class="left-item bg-left" style="padding: 20px; margin-top: 30px">
    <div class="title" style="margin-top: 10px" id="bonus-title"></div>
</div>
<div class="text-big m20" id="bonus-description"></div>

<div style="position: relative; text-align: center; margin: 30px">
    <linkButton id="submit-button" class="submit p10" href="/about" style="border-radius: 10px; background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">На главную</linkButton>
</div>
`;


export function source(element, router) {
    document.title = "SQuest | Поздравляем";
    element.innerHTML = html;

    ajax('GET', '/api/quest_bonuspage', null, (status, response) => {
        if (status == 200) {// valide
            document.getElementById("bonus-title").innerHTML = response.title;
            document.getElementById("bonus-description").innerHTML = response.description;
        } else { // invalide
            document.title = "SQuest | Сюда низя";
            document.getElementById("bonus-title").innerHTML = "Тебе сюда нельзя";
            document.getElementById("bonus-description").innerHTML = response.error;
            if (status == 401) {
                document.getElementById("submit-button").setAttribute('href', '/login');
                document.getElementById("submit-button").innerText = "Войти";
            } else {
                document.getElementById("submit-button").setAttribute('href', '/play');
                document.getElementById("submit-button").innerText = "К квесту";
            }
        }
    });
}