import * as login from "./pages/login.html.js";
import * as register from "./pages/register.html.js";
import * as me from "./pages/me.html.js";

export function render(target, path, router) {
    const body = document.getElementById(target);
    try {
        console.log("Render " + path.substring(1) + ".html");
        return eval(path.substring(1)).source(body, router);
    } catch {
        console.log("Bad try to render " + path.substring(1) + ".html");
        body.innerHTML = "Error in \"" + path.substring(1) + ".html" + "\"";
        return null;
    }
}