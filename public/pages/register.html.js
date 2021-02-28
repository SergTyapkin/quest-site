import {ajax} from "../ajax.js";

export const html = `
<form id="form">
    <div class="center">
        <div class="title">Регистрация</div>
        <div class="text">Ну давай, покажи всю свою оригинальность</div>
    </div>
    <div class="form text">
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ЛОГИН <span class="error" id="nicknameError"></span></label></div>
            <input class="fullwidth p10" type="text"  id="nickname-form">
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ПАРОЛЬ <span class="error" id="passwordError"></span></label></div>
            <input class="fullwidth p10" type="password" id="password-form">
            <div class="text-small" style="padding: 5px 0 5px 0">Не забудь его только</div>
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">E-mail <span class="error" id="emailError"></span></label></div>
            <input class="fullwidth p10" type="email" id="email-form">
            <div class="text-small" style="padding: 5px 0 5px 0">Когда-нибудь пароль придётся восстанавливать</div>
        </div>
        <div class="mtb20">
            <div><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Погнали"></div>
            <div class="text" style="padding: 5px 0 5px 0">Уже есть аккаунт? <linkButton href="/login">Войти</linkButton></div>
        </div>
    </div>
</form>
`;

export function source(element, router) {
    document.title = "Регистрация";
    element.innerHTML = html;

    document.getElementById("form").addEventListener("submit", (event) => {
        event.preventDefault();
        const nickname = document.getElementById("nickname-form").value.trim();
        const password = document.getElementById("password-form").value.trim();
        const email = document.getElementById("email-form").value.trim();

        ajax("POST", "/register", {nickname, password, email}, (status, response) => {
            if (status == 200) { // valide
                router.goto("/me");
            } else { // invalide
                if (response.nicknameError)
                    document.getElementById("nicknameError").innerText = response.nicknameError;
                if (response.passwordError)
                    document.getElementById("passwordError").innerText = response.passwordError;
                if (response.emailError)
                    document.getElementById("emailError").innerText = response.emailError;
            }
        });
    });
}