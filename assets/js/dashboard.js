const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";

document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);
    let logout = document.getElementById("logout");
    logout.addEventListener("click", function(){
        sessionStorage.clear;
        window.location.replace("index.html");
    })
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
        let listContainer = document.getElementById("db_table_container");
        listContainer.innerHTML = "";

        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[1] == sessionStorage.getItem(user_id)) {
                addRow(listContainer, line);               
            }
        }

        updateBalance();
        startTimer();
    });
}

function addRow(listContainer, line){
    listContainer.innerHTML += `
    <div class="listrow background_lblue">
        <div class="listitem_left textcolor_white">
            picture
        </div>
        <div class="listitem_middle">
            <div class="listitem_middle_top textcolor_white font_cinzel">${line[4]}</div>
            <div class="listitem_middle_bottom textcolor_white ">${line[2]}</div>
        </div>
        <div class="listitem_right">
            <span class="balance textcolor_white">${line[5]}</span>
            <span class=" textcolor_white">EUR</span>
        </div>
    </div>
    `;
}

