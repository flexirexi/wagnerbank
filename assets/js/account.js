const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id";

document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);
    let logout = document.getElementById("logout");
    logout.addEventListener("click", logout_user);
    startCountdown()
    addNameToNavBar();
    fillWebsite();
})

function logout_user(){
    sessionStorage.clear;
    window.location.replace("index.html");
}

function addNameToNavBar() {
    let span = document.getElementById("nav_bar_right_text");
    span.innerHTML = `Hello, ${sessionStorage.getItem(user_first)} ${sessionStorage.getItem(user_last)}!`;
}

function fillWebsite() {
    fetch("./assets/data/data_account_trnsx.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;
        let listContainer = document.getElementById("acc_table_container");
        let menu_btn = document.getElementsByClassName("acc_dropdown")[0];
        
        menu_btn.addEventListener("click", function(){
            let dropdown_content = document.getElementsByClassName("acc_dropdown-content")[0];
            dropdown_content.style.display == "block" ? dropdown_content.style.display = "none" : dropdown_content.style.display = "block";
        })
        
        listContainer.innerHTML = "";
        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[1] == sessionStorage.getItem(acc_id)) {
                addRow(listContainer, line);               
            }
        }
        updateBalance();
    });
}

function addRow(listContainer, line){
    listContainer.innerHTML += `
    <div class="acc_listrow background_lblue">
        <div class="listitem_left textcolor_white"> ${line[4].split(" ")[0]} </div>
        <div class="listitem_middle">
            <div class="listitem_middle_top textcolor_white font_cinzel">${line[8]}</div>
            <div class="listitem_middle_bottom textcolor_white ">${line[9]}</div>
        </div>
        <div class="listitem_right">
            <span class="balance textcolor_white">${new Intl.NumberFormat('no', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(line[7])}</span>
            <span class=" textcolor_white">EUR</span>
        </div>
    </div>
    `;


}

function updateBalance(){
    let balances = document.getElementsByClassName("balance");
    let total = document.getElementById("acc_subtotal_amount")
    let total_amount = 0.00;
    let amount = 0.00;
    for(let balance of balances){
        amount = parseFloat(balance.innerHTML.replace("&nbsp;", "").replace(",",".").replace("−", "-"));
        total_amount += amount;
    }
    total.innerHTML = new Intl.NumberFormat('no', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(total_amount);
}

function startCountdown() {
    let footer_timer = document.getElementById("footer_timer_text");
    let footer_timer_msgbox = document.getElementById("timer_msgbox_text");
    let timer_msgbox_container = document.getElementById("timer_msgbox_container");
    let timer_msgbox_btn = document.getElementById("timer_msgbox_btn");
    let interval = 1000;
    let timer = 180000;
    let timer_text;

    var countdown = window.setInterval(function(){
        timer -= interval; 
        timer_text = Math.floor(timer/60000).toString().padStart(2, "0") + ":" + (timer%60000/1000).toString().padStart(2,"0");
        footer_timer_msgbox.innerHTML = timer_text;
        footer_timer.innerHTML = timer_text;
        if(timer==25000) {
            timer_msgbox_container.style.display = "block"
            timer_msgbox_btn.addEventListener("click", function(){
                footer_timer.innerHTML = "03:00";
                timer_msgbox_container.style.display = "none";
                clearInterval(countdown);
                startCountdown();
            });
        }
        if(timer<=0) {
            clearInterval(countdown);
            logout_user();
        }

    }, interval);
}