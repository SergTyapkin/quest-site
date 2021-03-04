import {ajax} from "../ajax.js";

const html = `
<div id="choose-quest" style="transition: all 1s ease; left: 0%; width: 100%">
    <div class="left-item bg-left" style="padding: 20px; margin-top: 30px">
        <div class="title">Рейтинг</div>
    </div>
    <div id="users-listing" style="overflow-x: hidden">
    </div>
</div>

<div style="position: relative; text-align: center; margin: 30px">
    <linkButton class="submit p10" href="/about" style="border-radius: 10px; background: linear-gradient(90deg, rgba(71, 56, 20, 0.4) 0%, rgba(84,69,25,0.7) 100%) 50% 50% no-repeat">На главную</linkButton>
</div>
`;

export function source(element, router) {
    document.title = "SQuest | Рейтинг";
    element.innerHTML = html;

    ajax('GET', '/api/rating', null, (status, response) => {
        const listing = document.getElementById("users-listing");
        response.users.forEach((user) => {
            console.log(user);
            listing.innerHTML += `<div class="fullwidth left-item text-big listing-item p20" style="display: block">
                                      ${user.nickname}
                                      <span class="title choose" style="margin: 0 30px"><arrow class="arrow right" style="margin-left: 10px; display: inline-block;"></arrow>
                                          ${user.rating}
                                      </span>
                                  </div>`;
        });
    });
}