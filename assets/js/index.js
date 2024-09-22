document.addEventListener("DOMContentLoaded", function () {
    let login_form = document.getElementById("login_form");

    login_form.addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("username").value;
        let pw = document.getElementById("pw").value;
        login(username, pw);
    })
})

function login(login_username, login_pw) {
    fetch("./assets/data/data_login.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;

        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[3] == login_username && line[4] == login_pw) {
                localStorage.setItem("id", line[0]);
                localStorage.setItem("firstname", line[1]);
                localStorage.setItem("lastname", line[2]);

                alert(`Welcome back to Wagner Bank, ${localStorage.getItem("first_name")} ${localStorage.getItem("last_name")}! \n` + localStorage.getItem("id"));
                window.location.assign("dashboard.html");
                return;
            }
        }
        alert("Wrong USERNAME or PASSWORD. Please try again.");
        return;
    });
    return;
}

