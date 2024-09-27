const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
/**
 * The script will only execute after the html has been loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    let login_form = document.getElementById("login_form");

    login_form.addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("username").value;
        let pw = document.getElementById("pw").value;
        login(username, pw);
    });
});

/**
 * index.html is a very minimalistic page, so, there is not much to load at the beginning
 * but now: the login process starts which initiates some variables for the whole login session
 * initially, only fetch with get and post method were used but post doesnt seem to be allowed at github/gitpod which makes
 * perfectly sence -> switch to sessionstorage data
 * @param {the username that the user entered} login_username 
 * @param {the password that the user entered} login_pw 
 */
function login(login_username, login_pw) {
    fetch("./assets/data/data_login.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;

        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[3] == login_username && line[4] == login_pw) {
                sessionStorage.clear();
                sessionStorage.setItem(user_id, line[0]);
                sessionStorage.setItem(user_first, line[1]);
                sessionStorage.setItem(user_last, line[2]);

                alert(`Welcome back to Wagner Bank, ${sessionStorage.getItem(user_first)} ${sessionStorage.getItem(user_last)}! \n` + sessionStorage.getItem(user_id));
                window.location.replace("dashboard.html");
                return;
            }
        }
        alert("Wrong USERNAME or PASSWORD. Please try again.");
    });
}

