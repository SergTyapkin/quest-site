import {ajax} from "./../ajax.js";

export const html = `
<form id="form">
    <div class="center">
        <div class="title">Твой профиль</div>
        <div class="text">Ну давай, покажи всю свою оригинальность</div>
    </div>
    <div class="form text">
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ЛОГИН<span style="font-style: italic" id="loginErrorText"></span></label></div>
            <input class="fullwidth p10" type="text"  id="nickname-form">
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ПАРОЛЬ<span style="font-style: italic" id="passwordErrorText"></span></label></div>
            <input class="p10" style="width: 80%" type="password" id="password-form">
            <linkButton  href="/change-password" class="submit p10 fullwidth" type="password" style="color: #deb77a;">Сменить</linkButton>
            <div class="text-small" style="padding: 5px 0 5px 0"></div>
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">E-mail<span style="font-style: italic" id="emailErrorText"></span></label></div>
            <input class="fullwidth p10" type="email" id="email-form">
            <div class="text-small" style="padding: 5px 0 5px 0">Подтверждать придётся и со старой, и с новой</div>
        </div>
        <div style="margin-top: 20px">
            <div><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Изменить данные"></div>
        </div>
    </div>
</form>
<div><linkButton href='/login' class="submit center" style="color: inherit" onclick="document.cookie = 'userId=-1; max-age=-1';">Выйти</linkButton></div>
`;

export function source(element, router) {
    document.title = "Мой профиль";
    element.innerHTML = html;

    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        const nickname = document.getElementById("nickname-form").value.trim();
        const password = document.getElementById("password-form").value.trim();
        const email = document.getElementById("email-form").value.trim();
        ajax("POST", "/me", {nickname, password, email}, (status, response) => {
            if (status == 200) { // valide
                document.getElementById("error").innerText = "Не знаю, зачем тебе это, но данные изменены";
            } else { // invalide
                if (response.error)
                    document.getElementById("error").innerText = response.error;
            }
        });
    });

    ajax('GET', '/me', null, (status, response) => {
        if (status === 200) { // is authorized
            document.getElementById("nickname-form").value = response.nickname;
            //document.getElementById("password-form").value = response.password;
            document.getElementById("email-form").value = response.email;
        } else { // not authorized
            //element.getElementById("error").innerText = response.error;
            router.goto("/login");
        }
    });
}