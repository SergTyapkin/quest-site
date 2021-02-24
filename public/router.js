import * as renderer from "./renderer.js";

export default class Router {
    linkedButtons;
    request = new XMLHttpRequest();

    constructor() {
        window.onpopstate = ((event) => {
            event.preventDefault();
        });

        this.linkButtons();
    }

    linkButtons() {
        this.linkedButtons = document.querySelectorAll("linkButton");
        this.linkedButtons.forEach((button) => {
            //console.log("New link: " + button.innerHTML.toString());
            button.addEventListener("click", (event) => {
                this.linksListener(event);
            });
        })
    }

    relinkButtons() {
        this.linkedButtons.forEach((button) => {
            //console.log("Remove link: " + button.innerText);
            button.removeEventListener("click", (event) => {
                this.linksListener(event);
            });
        })
        this.linkButtons();
    }

    linksListener(event) {
        event.preventDefault();
        this.goto(event.currentTarget.getAttribute("href").toString());
    }

    goto(path) {
        history.pushState({}, "", path);
        renderer.render("body", path, this);
        this.relinkButtons();
    }

    back() {
        history.back();
    }

    forward() {
        history.forward();
    }
}