import * as login from "./pages/login.html.js";
import * as register from "./pages/register.html.js";
import * as me from "./pages/me.html.js";
import * as about from "./pages/about.html.js";
import * as quest from "./pages/quest.html.js";
import * as play from "./pages/play.html.js";
import * as quest_bonuspage from "./pages/quest_bonuspage.html.js";
import * as set_quest_answer from "./pages/set_quest_answer.html.js";
import * as set_user_progress from "./pages/set_user_progress.html.js";
import * as rating from "./pages/rating.html.js";

export function render(target, path, router, callback) {
    const body = document.getElementById(target);
    try {
        console.log("Render " + path.substring(1) + ".html");
        body.style.opacity = "0%";
        setTimeout(() => {
            eval(path.substring(1)).source(body, router);
            body.style.opacity = "100%";
            callback();
        }, 200);
    } catch {
        console.log("Bad try to render " + path.substring(1) + ".html");
        body.innerHTML = "Error in \"" + path.substring(1) + ".html" + "\"";
    }
}