import Router from "./router.js";
import {ajax} from "./ajax.js";

const router = new Router();

ajax("GET", "/me", {}, (status, response) => {
    if (status == 200) { // valide
        document.getElementById("nickname").innerText = response.nickname;
        router.goto("/me");
    } else { // invalide
        router.goto("/about");
    }
});
