import {ajax} from "../ajax.js";

export const html = `
<div>This is login page.</div>
<form id="form">
<div><span>Your nickname:</span> <input id="nickname-form"></div>
<div><span>Your password:</span> <input id="password-form"></div>
<div><input type="submit" value="Погнали"></div>
</form>
<div id="error"></div>
<div><linkButton href='/register'>Go to register</linkButton></div>
<div><linkButton href='/me'>Go to my profile</linkButton></div>
`;

export function source(element, router) {
    document.title = "Логин";
    element.innerHTML = html;

    document.getElementById("form").addEventListener("submit", (event) => {
       event.preventDefault();
       const nickname = document.getElementById("nickname-form").value.trim();
       const password = document.getElementById("password-form").value.trim();
       ajax("POST", "/login", {nickname, password}, (status, response) => {
           if (status == 200) { // valide
                router.goto("/me");
           } else { // invalide
               if (response.error)
                   document.getElementById("error").innerText = response.error;
           }
       });
    });
}