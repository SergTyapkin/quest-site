import {ajax} from "../ajax.js";

const html = `
<div class="left-item bg-left" style="padding: 20px; margin-top: 30px">
    <div class="title" style="margin-top: 10px">Смена итогового ответа</div>
</div>
<div class="text-big m20">Если ты попал сюда случайно - вiйди, розбийник.... <br> пожалуйста...</div>

<form id="form" class="form">
    <div class="center">
        <div class="title">Новый итоговый ответ</div>
    </div>
    <div class="text">
        <div class="error" id="answerError"></div>
        <div class="mtb20"><input class="fullwidth p10" type="text"  id="answer-form"></div>
        <div class="mtb20"><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Изменить"></div>
    </div>
</form>
<div style="position: relative; text-align: center; margin: 30px">
    <linkButton class="submit p10" href="/about" style="border-radius: 10px; background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">На главную</linkButton>
</div>
`;

export function source(element, router) {
    document.title = "СМЕНА ОТВЕТА";
    element.innerHTML = html;

    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = document.getElementById("answer-form").value.trim();

        ajax("POST", "/api/admin/set-answer-all", {answer}, (status, response) => {
            if (status == 200) { // valide
                document.getElementById("answerError").style.color = "#bfde3d";
                document.getElementById("answerError").innerText = "Успешно изменено";
            } else { // invalide
                document.getElementById("answerError").innerText = "Что-то пошло не так";
            }
        });
    });
}