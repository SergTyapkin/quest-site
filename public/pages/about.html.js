export const html = `
<div>This is about page.</div>
<div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
<div><linkButton href='/register'>Go to register</linkButton></div>
<div><linkButton href='/me' class="submit">Go to my profile</linkButton></div>
`;

export function source(element, router) {
    document.title = "О нас";
    element.innerHTML = html;
}