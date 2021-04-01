import {ajax} from "../ajax.js";

const html = `
<form id="form" class="form">
    <div class="center">
        <div class="title">Вход</div>
        <div class="text">Ну давай, вспомни пароль, войди в меня</div>
    </div>
    <div class="text">
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ЛОГИН <span class="error" id="nicknameError"></span></label></div>
            <input class="fullwidth p10" type="text"  id="nickname-form">
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ПАРОЛЬ <span class="error" id="passwordError"></span></label></div>
            <input class="fullwidth p10" type="password" id="password-form">
            <div class="text-small" style="padding: 5px 0 5px 0"><linkButton href="/about">Забыл пароль?</linkButton> - пей таблетки</div>
        </div>
        <div class="mtb20">
            <div><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Погнали"></div>
            <div class="text" style="padding: 5px 0 5px 0">Нужен аккаунт? <linkButton href="/register">Создать</linkButton></div>
        </div>
    </div>
</form>
`;

export function source(element, router) {
    document.title = "SQuest | Логин";
    element.innerHTML = html;
    document.getElementById("nickname-form").focus();

    document.getElementById("form").addEventListener("submit", (event) => {
       event.preventDefault();
       const nickname = document.getElementById("nickname-form").value.trim();
       const password = document.getElementById("password-form").value.trim();

       ajax("POST", "/api/login", {nickname, password}, (status, response) => {
           if (status == 200) { // valide
               document.getElementById("nickname-button").innerText = nickname;
               document.getElementById("nickname-button").setAttribute('href', '/me');
               router.goto("/me");
           } else { // invalide
               if (response.nicknameError)
                   document.getElementById("nicknameError").innerText = response.nicknameError;
               if (response.passwordError)
                   document.getElementById("passwordError").innerText = response.passwordError;
           }
       });
    });
}