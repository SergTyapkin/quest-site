import {ajax} from "./../ajax.js";

const html = `
<div class="left-item bg-left" style="padding: 20px; margin-top: 30px">
    <div class="title-big">Выбор ветки</div>
    <div class="title">Квест "<span id="quest-title"></span>"</div>
    <div class="text" id="quest-description"></div>
</div>
<div id="branches-listing">
</div>
<div style="position: relative; text-align: center; margin: 30px">
    <linkButton class="submit light p10" href="/play" style="background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">Регистрация</linkButton>
</div>
`;

export function source(element, router) {
    document.title = "Выбор ветки";
    element.innerHTML = html;

    ajax('GET', '/api/branch', null, (status, response) => {
        document.getElementById("quest-title").innerText = response.title;
        document.getElementById("quest-description").innerText = response.description;

        const listing = document.getElementById("branches-listing");
        listing.innerHTML = "";
        for (let i = 0; i < response.branches.length; i++) {
            let description = '';
            if (response.branches[i].description)
                description = `<div href="/play" class="text">${response.branches[i].description}</div>`;

            listing.innerHTML += `<linkButton href="/play" class="fullwidth left-item text-big listing-item" style="padding: 20px; display: inline-block" onclick="document.cookie = 'branchId=${i}; max-age=10000000000';">
                                    ${response.branches[i].title}
                                    <span class="text choose" style="margin: 0 30px">ВЫБРАТЬ<span class="arrow right" style="display: inline-block;"></span></span>
                                    ${description}
                                  </linkButton>`;
        }
        router.relinkButtons();
    });
}