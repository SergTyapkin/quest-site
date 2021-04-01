import Router from "./router.js";
import {ajax} from "./ajax.js";

const router = new Router();

ajax("GET", "/api/me", {}, (status, response) => {
    if (status == 200) { // valide
        document.getElementById("nickname-button").innerText = response.nickname;
        document.getElementById("nickname-button").setAttribute('href', '/me');
        document.getElementById("progressbar").style.backgroundPositionX = `${100 - 100 / response.len * response.progress}%`;
        document.getElementById("progress").innerText = response.progress;
    } else { // invalide
        document.getElementById("progressbar").style.backgroundPositionX = "100%";
        document.getElementById("nickname-button").setAttribute('href', '/login');
    }
    if (location.pathname === '/') {
        router.goto('/about');
    } else {
        router.goto(location.pathname);
    }
});