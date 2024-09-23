const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";

document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);

    addNameToNavBar();
    fillWebsite();

    
})

function addNameToNavBar() {
    let span = document.getElementById("nav_bar_right_text");
    span.innerHTML = `Hello, ${sessionStorage.getItem(user_first)} ${sessionStorage.getItem(user_last)}!`;
}

function fillWebsite() {
    fetch("./assets/data/data_accounts.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;

        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[1] == sessionStorage.getItem(user_id)) {
                alert("funzt: " + line[4])                
            }
        }

        updateBalance();
        startTimer();
    });
}