import Router from "./router.js";
import {ajax} from "./ajax.js";

const router = new Router();

ajax("GET", "/api/me", {}, (status, response) => {
    if (status == 200) { // valide
        document.getElementById("nickname").innerText = response.nickname;
        document.getElementById("me/login-button").setAttribute('href', '/me');
        console.log(`${100 - 100 / response.len * response.progress}%`);
        document.getElementById("progressbar").style.backgroundPositionX = `${100 - 100 / response.len * response.progress}%`;
        document.getElementById("progress").innerText = response.progress;
        router.goto("/me");
    } else { // invalide
        document.getElementById("progressbar").style.backgroundPositionX = "100%";
        document.getElementById("me/login-button").setAttribute('href', '/login');
        router.goto("/about");
    }
});