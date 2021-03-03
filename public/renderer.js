import * as login from "./pages/login.html.js";
import * as register from "./pages/register.html.js";
import * as me from "./pages/me.html.js";
import * as about from "./pages/about.html.js";
import * as branch from "./pages/branch.html.js";
import * as quest from "./pages/quest.html.js";
import * as play from "./pages/play.html.js";

export function render(target, path, router, callback) {
    const body = document.getElementById(target);
    try {
        console.log("Render " + path.substring(1) + ".html");
        body.classList.remove("loaded-animation");
        setTimeout(() => {
            eval(path.substring(1)).source(body, router);
            body.classList.add("loaded-animation");
            callback();
        }, 200);
    } catch {
        console.log("Bad try to render " + path.substring(1) + ".html");
        body.innerHTML = "Error in \"" + path.substring(1) + ".html" + "\"";
    }
}