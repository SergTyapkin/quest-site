import {ajax} from "./../ajax.js";

const html = `
<div class="fullwidth" style="position: absolute; margin-top: -100px">
    <linkButton href="/play" class="left-item text-big listing-item ptb20 double-item-left" style="overflow: hidden">
        <span class="title choose" style="margin: 0 30px; opacity: 100%; font-size: 20px"><span class="arrow left" style="display: inline-block"></span>К квесту</span>
    </linkButton>
    <linkButton href="/rating" class="right-item text-big listing-item ptb20 double-item-right">
        <span class="title choose" style="margin: 0 30px; opacity: 100%; font-size: 20px">Рейтинг<span class="arrow right" style="display: inline-block"></span></span>
    </linkButton>
</div>

<div class="form text" style="margin-top: 150px">
    <div class="center">
        <div class="title">Твой профиль</div>
    </div>
    <form id="form-data">
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ТВОЙ ЛОГИН <span class="error" id="nicknameError"></span></label></div>
            <input class="fullwidth p10" type="text"  id="nickname-form">
        </div>
        <div class="mtb20">
            <div><label class="text-big" style="font-family: Arial">ТВОЙ E-mail <span class="error" id="emailError"></span></label></div>
            <input class="fullwidth p10" type="text" id="email-form">
            <div class="text-small" style="padding: 5px 0 5px 0">Подтверждать придётся и со старой, и с новой</div>
        </div>
        <div class="mtb20">
            <div class="success" id="completeDataChange"></div>
            <div><input class="submit fullwidth center p10" style="border-color: #b08946; outline: none" type="submit" value="Изменить данные"></div>
        </div>
    </form>
    <form id="form-password">
        <div>
            <div><label class="text-big" style="font-family: Arial">СМЕНИТЬ ПАРОЛЬ <span class="error" id="passwordError"></span></label></div>
            <input class="p10" style="width: 78%; display: inline"" type="password" id="password-form" placeholder="Старый пароль">
            <input class="submit p10" style="width: 20%; font-size: 1em; color: #deb77a; display: inline" type="submit" value="Сменить" id="button-password-form">
        </div>
        <div id="new-password-block" style="opacity: 0%; padding-bottom: 20px; height: 0; overflow-x: hidden; transition: all 1s ease-out">
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

<div id="admin-button" style="position: relative; text-align: center; margin: 30px; display: none">
    <linkButton class="submit p10" href="/admin" style="border-radius: 10px; background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">На админскую</linkButton>
</div>
`;

export function source(element, router) {
    document.title = "SQuest | Профиль";
    element.innerHTML = html;

    document.getElementById("form-data").addEventListener("submit", (event) => {
        event.preventDefault();
        const nickname = document.getElementById("nickname-form").value.trim();
        const email = document.getElementById("email-form").value.trim();
        ajax("POST", "/api/me/change-data", {nickname, email}, (status, response) => {
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

        let newPasswordBlock = document.getElementById("new-password-block");
        if (newPassword === "") {
            ajax("POST", "/api/me/check-password", {password}, (status, response) => {
                if (status == 200) { // valide
                    document.getElementById("button-password-form").style.display = "none";
                    document.getElementById("password-form").style.width = "100%";
                    document.getElementById("password-form").setAttribute("disabled", "");
                    document.getElementById("new-password-form").focus();
                    newPasswordBlock.style.height = `${newPasswordBlock.scrollHeight}px`;
                    newPasswordBlock.style.opacity = "100%";
                    document.getElementById("passwordError").innerText = "";
                } else { // invalide
                    document.getElementById("button-password-form").style.display = "inline";
                    document.getElementById("password-form").style.width = "78%";
                    document.getElementById("password-form").removeAttribute("disabled");
                    newPasswordBlock.style.height = "0";
                    newPasswordBlock.style.opacity = "0%";
                    if (response.passwordError)
                        document.getElementById("passwordError").innerText = response.passwordError;
                }
            });
        } else {
            ajax("POST", "/api/me/change-password", {password, newPassword}, (status, response) => {
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

    ajax('GET', '/api/me', null, (status, response) => {
        if (status === 200) { // is authorized
            document.getElementById("nickname-form").value = response.nickname;
            document.getElementById("email-form").value = response.email;

            ajax("GET", "/api/admin", null, (status, response) => {
                if (status == 200) { // valide
                    document.getElementById("admin-button").style.display = "block";
                }
            });
        } else { // not authorized
            //element.getElementById("error").innerText = response.error;
            router.goto("/login");
        }
    });
}