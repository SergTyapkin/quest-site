import {ajax} from "./../ajax.js";

const html = `
<div class="left-item bg-left" style="padding: 20px; margin-top: 30px">
    <div class="text">Квест: <span id="quest-title"></span></div>
    <div class="text">Ветка: <span id="branch-title"></span></div>
    <div class="title" style="margin-top: 10px" id="task-title"></div>
</div>
<div class="text-big m20" id="task-description"></div>

<form id="form" class="form">
    <div class="center">
        <div class="title" id="task-question"></div>
    </div>
    <div class="text">
        <div class="error" id="answerError"></div>
        <div class="mtb20"><input class="fullwidth p10" type="text"  id="answer-form"></div>
        <div class="mtb20"><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Ответить"></div>
    </div>
</form>
<div id="new-quest-button" style="position: relative; text-align: center; margin: 30px; display: none">
    <linkButton class="submit p10" href="/quest" style="border-radius: 10px; background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">Выбрать новый квест</linkButton>
</div>

<ul class="underbar-contacts" id="underbar-contacts">
    <!--div><li style="padding: 0px 0 0px 10px">
        <span>Контакты</span>
    </li></div-->
    <li>
        <span class="title" style="font-size: 18px; font-family: Arial; margin-right: 10px">За подсказками:</span>
        <span><a href="https://vk.com/squest_studio" target="_blank" style="color: inherit; text-shadow: 0 0 8px #c3a38e">vk.com/squest_studio</a></span>
    </li>
</ul>
`;

export function source(element, router) {
    document.title = "SQuest | Квест";
    element.innerHTML = html;
    document.getElementById("body").style.paddingBottom = `${document.getElementById("underbar-contacts").scrollHeight}px`;

    ajax('GET', '/api/play', null, (status, response) => {
        if (status == 200) // valide
            ;
        else if (status == 401) // invalide
                return router.goto("/quest");
        else
            return router.goto("/login");

        document.getElementById("progress").innerText = response.progress;
        document.getElementById("progressbar").style.backgroundPositionX = `${100 - 100 / response.len * response.progress}%`;

        document.getElementById("quest-title").innerHTML = response.questTitle;
        document.getElementById("branch-title").innerHTML = response.branchTitle;
        document.getElementById("task-title").innerHTML = response.title;
        document.getElementById("task-description").innerHTML = response.description;
        document.getElementById("task-question").innerHTML = response.question;

        if (!response.question) {
            document.getElementById("form").style.display = "none";
            document.getElementById("new-quest-button").style.display = "block";
        }
    });

    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = document.getElementById("answer-form").value.trim();

        ajax("POST", "/api/play", {answer}, (status, response) => {
            if (status == 200) { // valide
                router.goto("/play");
            } else { // invalide
                if (response.answerError)
                    document.getElementById("answerError").innerText = response.answerError;
            }
        });
    });
};