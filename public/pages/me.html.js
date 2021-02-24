import {ajax} from "./../ajax.js";

export const html = `
<div>This is your profile page.</div>
<form id="form">
<div><span>Your nickname:</span> <input id="nickname-form"></div>
<div><span>Your password:</span> <input id="password-form"></div>
<div><span>Your email:</span> <input id="email-form"></div>
<div><input type="submit" value="Поменять данные"></div>
</form>
<div id="error"></div>
<div><linkButton><a  href='/login'>Go to login</a></linkButton></div>
<div><linkButton><a  href='/register'>Go to register</a></linkButton></div>
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
            document.getElementById("password-form").value = response.password;
            document.getElementById("email-form").value = response.email;
        } else { // not authorized
            //element.getElementById("error").innerText = response.error;
            router.goto("/login");
        }
    });
}