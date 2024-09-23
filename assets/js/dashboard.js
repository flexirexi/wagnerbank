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
    let fontawesome = document.createElement("i");
    
    switch(line[3]) {
        case "current account":
            fontawesome.className = "fa-solid fa-building-columns"
            
        case "savings account":
            fontawesome.className = "fa-solid fa-piggy-bank fa-xl"
        case "credit card":
            fontawesome.className = "fa-solid fa-building-columns"
        default:
    }
    alert(line[3] + ": " + fontawesome.outerHTML);

    listContainer.innerHTML += `
    <div class="listrow background_lblue">
        <div class="listitem_left textcolor_white"> ${fontawesome.outerHTML} </div>
        <div class="listitem_middle">
            <div class="listitem_middle_top textcolor_white font_cinzel">${line[4]}</div>
            <div class="listitem_middle_bottom textcolor_white ">${line[2]}</div>
        </div>
        <div class="listitem_right">
            <span class="balance textcolor_white">${new Intl.NumberFormat('no').format(line[5])}</span>
            <span class=" textcolor_white">EUR</span>
        </div>
    </div>
    `;
}

function updateBalance(){
    let balances = document.getElementsByClassName("balance");
    let total = document.getElementById("db_subtotal_amount")
    let total_amount = 0;
    let amount = 0;
    for(let balance of balances){
        amount = parseFloat(balance.innerHTML.replace("&nbsp;", "").replace(",",".").replace("−", "-"))
        total_amount += amount;
    }
    total.innerHTML = new Intl.NumberFormat('no').format(total_amount);
}
