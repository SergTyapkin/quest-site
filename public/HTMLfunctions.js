function logout() {
    document.cookie = 'userId=-1; max-age=-1';
    document.getElementById("nickname-button").innerText = "Войти";
    document.getElementById("nickname-button").setAttribute('href', '/login');
}