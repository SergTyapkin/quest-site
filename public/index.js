import Router from "./router.js";
import {ajax} from "./ajax.js";

const router = new Router();

ajax("GET", "/me", {}, (status, response) => {
    if (status == 200) { // valide
        document.getElementById("nickname").innerText = response.nickname;
        document.getElementById("me/login-button").setAttribute('href', '/me');
        router.goto("/me");
    } else { // invalide
        router.goto("/about");
        document.getElementById("me/login-button").setAttribute('href', '/login');
    }
});