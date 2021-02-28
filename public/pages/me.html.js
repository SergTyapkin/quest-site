import {ajax} from "./../ajax.js";

export const html = `
<div class="form text">
    <div class="center">
        <div class="title">Твой профиль</div>
    </div>
    <form id="form-data">
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ЛОГИН <span class="error" id="nicknameError"></span></label></div>
            <input class="fullwidth p10" type="text"  id="nickname-form">
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">E-mail <span class="error" id="emailError"></span></label></div>
            <input class="fullwidth p10" type="email" id="email-form">
            <div class="text-small" style="padding: 5px 0 5px 0">Подтверждать придётся и со старой, и с новой</div>
        </div>
        <div class="mtb20">
            <div class="success" id="completeDataChange"></div>
            <div><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Изменить данные"></div>
        </div>
    </form>
    <form id="form-password">
        <div>
            <div><label class="text-big" style="font-family: Arial">ПАРОЛЬ <span class="error" id="passwordError"></span></label></div>
            <input class="p10" style="width: 80%" type="password" id="password-form" placeholder="Старый пароль">
            <input class="submit p10" style="color: #deb77a; display: inline" type="submit" value="Сменить" id="button-password-form">
        </div>
        <div id="new-password-block" style="opacity: 0%; padding-bottom: 20px; height: 0; overflow: hidden; transition: all 1s ease-out">
            <div class="error" id="newPasswordError"></div>
            <input class="p10 fullwidth mtb10" type="password" id="new-password-form" placeholder="Новый пароль">
            <div class="success" id="completePasswordChange"></div>
            <div><input class="submit fullwidth center p10 m0" style="border-color: #b08946; outline: none" type="submit" value="Сменить пароль"></div>
        </div>
        <div style="text-align: center; margin-bottom: 20px">
            <linkButton id="logout-button" class="submit p10 fullwidth" href="/about" style="color: #d2c2ac; border-width: 1px; display: inline-block; box-sizing: border-box;" onclick="logout();">Выйти</linkButton>
        </div>
    </form>
</div>
`;

export function source(element, router) {
    document.title = "Мой профиль";
    element.innerHTML = html;

    document.getElementById("form-data").addEventListener("submit", (event) => {
        event.preventDefault();
        const nickname = document.getElementById("nickname-form").value.trim();
        const email = document.getElementById("email-form").value.trim();
        ajax("POST", "/me/change-data", {nickname, email}, (status, response) => {
            if (status == 200) { // valide
                document.getElementById("completeDataChange").innerText = "Не знаю, зачем тебе это, но данные изменены";
                document.getElementById("nicknameError").innerText = "";
                document.getElementById("emailError").innerText = "";
            } else { // invalide
                if (response.nicknameError)
                    document.getElementById("nicknameError").innerText = response.nicknameError;
                if (response.emailError)
                    document.getElementById("emailError").innerText = response.emailError;
            }
        });
    });

    document.getElementById("form-password").addEventListener("submit", (event) => {
        event.preventDefault();

        const password = document.getElementById("password-form").value.trim();
        const newPassword = document.getElementById("new-password-form").value.trim();

        if (newPassword === "") {
            ajax("POST", "/me/check-password", {password}, (status, response) => {
                if (status == 200) { // valide
                    document.getElementById("button-password-form").style.display = "none";
                    document.getElementById("password-form").style.width = "100%";
                    document.getElementById("new-password-block").style.height = "auto";
                    document.getElementById("new-password-block").style.opacity = "100%";
                    document.getElementById("passwordError").innerText = "";
                } else { // invalide
                    document.getElementById("button-password-form").style.display = "inline";
                    document.getElementById("password-form").style.width = "80%";
                    document.getElementById("new-password-block").style.height = "0";
                    document.getElementById("new-password-block").style.opacity = "0%";
                    if (response.passwordError)
                        document.getElementById("passwordError").innerText = response.passwordError;
                }
            });
        } else {
            ajax("POST", "/me/change-password", {password, newPassword}, (status, response) => {
                if (status == 200) { // valide
                    document.getElementById("passwordError").innerText = "";
                    document.getElementById("newPasswordError").innerText = "";
                    document.getElementById("completePasswordChange").innerText = "Не знаю, зачем тебе это, но пароль изменен";
                } else { // invalide
                    if (response.passwordError)
                        document.getElementById("passwordError").innerText = response.passwordError;
                    if (response.newPasswordError)
                        document.getElementById("newPasswordError").innerText = response.newPasswordError;
                }
            });
        }
    });

    ajax('GET', '/me', null, (status, response) => {
        if (status === 200) { // is authorized
            document.getElementById("nickname-form").value = response.nickname;
            document.getElementById("email-form").value = response.email;
        } else { // not authorized
            //element.getElementById("error").innerText = response.error;
            router.goto("/login");
        }
    });
}