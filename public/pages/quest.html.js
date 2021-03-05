import {ajax} from "./../ajax.js";

const html = `
<div id="choose-quest" style="transition: all 1s ease; left: 0%; position: absolute; width: 100%">
    <div class="left-item bg-left" style="padding: 20px; margin-top: 30px">
        <div class="title">Выбор квеста</div>
        <div class="text">Выбирай первый понравившийся и погнали!</div>
    </div>
    <div id="quests-listing" style="overflow-x: hidden">
    </div>
</div>

<div id="confirm" style="display: block; opacity: 0%; right: -100%; transition: all 1s ease; position: absolute; width: 100%; overflow-x: hidden">
    <div id="back-button" class="fullwidth left-item text-big listing-item" style="margin: 30px 0 0 0; padding: 20px; display: block">
        <span class="title choose" style="margin: 0 30px"><arrow class="arrow left" style="margin-right: 10px; display: inline-block; opacity: 100%"></arrow>Назад</span>
    </div>
    <div class="left-item bg-left" style="text-align: center; padding: 20px; margin-top: 30px">
        <div class="text-big">Квест: <span class="title-big" id="quest-confirm-title"></span></div>
        <div class="text-big">Ветка: <span class="title-big" id="branch-confirm-title"></span></div>
        <div class="title" style="margin-top: 30px">Ты уверен?</div>
        <div class="text">Весь прогресс в уже выбранной ветке квеста будет сброшен.</div>
    </div>
    <div style="position: relative; text-align: center; margin: 30px">
        <linkButton id="confirm-button" class="submit p10" href="/play" style="background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">Начать ветку</linkButton>
    </div>
</div>
`;


export function source(element, router) {
    let choosedQuestId, choosedBranchId;
    let questTitle, branchTitle;

    document.title = "SQuest | Выбор квеста";
    element.innerHTML = html;

    ajax('GET', '/api/quest', null, (status, response) => {
        const listing = document.getElementById("quests-listing");
        listing.innerHTML = "";
        for (let i = 0; i < response.length; i++) {
            listing.innerHTML += `<div>
                                    <questButton data-quest-id="${i}" href="/branch" class="fullwidth left-item text-big listing-item p20" style="display: block">
                                        ${response[i]}
                                        <span class="text choose" style="margin: 0 30px">ВЫБРАТЬ<arrow class="arrow right" style="margin-left: 10px; display: inline-block;"></arrow></span>
                                    </questButton>
                                    <div style="height: 0px; overflow: hidden; opacity: 0%; transition: all 0.5s ease-out"></div>
                                  </div>`;
        }

        document.querySelectorAll("questButton").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();

                const arrow = button.querySelector("arrow");
                const branchesBlock =  button.parentElement.lastElementChild;
                if (!button.getAttribute("data-pressed")) {  // not pressed already
                    button.setAttribute("data-pressed", "yes");
                    button.style.backgroundSize = "100%";
                    arrow.style.transform = "rotate(135deg)";

                    let questId = button.getAttribute("data-quest-id");
                    if (!button.getAttribute("data-getted")) {  // not getted already
                        button.setAttribute("data-getted", "yes");
                        ajax("POST", "/api/branch", {questId}, (status, response) => {
                            if (status == 200) { // valide
                                branchesBlock.innerHTML = "";
                                for (let i = 0; i < response.length; i++) {
                                    branchesBlock.innerHTML += `<branchButton data-branch-id="${i}" class="fullwidth left-item text-big listing-item" style="padding: 20px 20px 20px 40px; display: inline-block">
                                                                  ${response[i].title}
                                                                  <span class="text choose" style="margin: 0 30px">ВЫБРАТЬ<span class="arrow right" style="display: inline-block;"></span></span>
                                                                  <div href="/play" class="text">${response[i].description}</div>
                                                                </branchButton>`;
                                }
                            } else { // invalide
                                router.goto("/quest");
                            }
                            branchesBlock.style.height = `${branchesBlock.scrollHeight}px`;
                            branchesBlock.style.opacity = "100%";

                            document.querySelectorAll("branchButton").forEach((branchButton) => {
                                branchButton.addEventListener("click", (event) => {
                                    document.getElementById("choose-quest").style.opacity = "0%";
                                    document.getElementById("choose-quest").style.left = "-100%";
                                    document.getElementById("confirm").style.opacity = "100%";
                                    document.getElementById("confirm").style.right = "0%";
                                    choosedBranchId = branchButton.getAttribute("data-branch-id");
                                    branchTitle = branchButton.firstChild.textContent;
                                    let quest = branchButton.parentElement.parentElement.firstElementChild;
                                    choosedQuestId = quest.getAttribute("data-quest-id");
                                    questTitle = quest.firstChild.textContent;

                                    document.getElementById("quest-confirm-title").innerText = questTitle;
                                    document.getElementById("branch-confirm-title").innerText = branchTitle;
                                });
                            });
                        });
                    } else {  // getted already
                        branchesBlock.style.height = `${branchesBlock.scrollHeight}px`;
                        branchesBlock.style.opacity = "100%";
                    };
                } else { // pressed already
                    button.removeAttribute("data-pressed");
                    button.style.backgroundSize = "0%";
                    arrow.style.transform = "rotate(45deg)";
                    branchesBlock.style.height = "0px";
                    branchesBlock.style.opacity = "0%";
                }
            });
        });
    });

    document.getElementById("back-button").addEventListener("click", (event) => {
        document.getElementById("choose-quest").style.opacity = "100%";
        document.getElementById("choose-quest").style.left = "0%";
        document.getElementById("confirm").style.opacity = "0%";
        document.getElementById("confirm").style.right = "-100%";
    });

    document.getElementById("confirm-button").addEventListener("click", (event) => {
        let questId = choosedQuestId, branchId = choosedBranchId;
        ajax('POST', '/api/quest', {questId, branchId}, (status, response) => {});
    });
}