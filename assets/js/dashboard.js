/**
 * the constants are needed to ensure a standardized sessionstorage get/set usage
 *  
 */
const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id", acc_kind = "account_kind", acc_name = "account_name", acc_number = "account_number";

/**
 * first, setting up some standard event listeners, then filling the website
 */
document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);
    let logout = document.getElementById("logout");
    logout.addEventListener("click", logout_user);
    startCountdown();
    addNameToNavBar();
    fillWebsite();
});

function logout_user(){
    sessionStorage.clear();
    window.location.replace("index.html");
}

function addNameToNavBar() {
    let span = document.getElementById("nav_bar_right_text");
    span.innerHTML = `Hello, ${sessionStorage.getItem(user_first)} ${sessionStorage.getItem(user_last)}!`;
}
/**
 * the concept of the login session: we load the server side csv files once - then save them as strings to session storage
 * why? when adding transaction, we need a data set in the same context -> we cant save new transactions here in sessionstorage 
 * and use csv all the time to load data -> mismatch -> so, once reading, then storing in this session
 * that gives us the opportunity to clear all data when loggin out
 * in addition, i save a lot of code because i dont have to handle async tasks here :)
 */
function fillWebsite() {
    fetch("./assets/data/data_accounts.csv").then(response => response.text()).then(data => {
        let line, lines;
        let listContainer = document.getElementById("db_table_container");
        listContainer.innerHTML = "";
        
        if(sessionStorage.getItem("accounts")==null){
            lines = data.split("\n");
            //here we will load the data to the sessionstorage - no need to read the above csv in this login session again
            //however, we cant permanently save new transactions (fot that I'd need sql..)
            sessionStorage.setItem("accounts", data);
        } else {
            lines = sessionStorage.getItem("accounts").split("\n");
            
        }
        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[1] == sessionStorage.getItem(user_id)) {
                addRow(listContainer, line);               
            }
        }
        updateBalance();
    });
}

function addRow(listContainer, line){
    let fontawesome = document.createElement("i");
    
    switch(line[3]) {
        case "current account":
            fontawesome.className = "fa-solid fa-building-columns fa-xl";
            break;
        case "savings account":
            fontawesome.className = "fa-solid fa-piggy-bank fa-xl";
            break;
        case "credit card":
            fontawesome.className = "fa-regular fa-credit-card fa-xl";
            break;
        default:
    }
    
    listContainer.innerHTML += `
    <div class="listrow background_lblue">
        <div class="listitem_left textcolor_white"> ${fontawesome.outerHTML} </div>
        <div class="listitem_middle">
            <div class="listitem_middle_top textcolor_white font_cinzel no_wrap">${line[4]}</div>
            <div class="listitem_middle_bottom textcolor_white no_wrap ">${line[2]}</div>
        </div>
        <div class="listitem_right">
            <span class="balance textcolor_white no_wrap">${new Intl.NumberFormat('no', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(line[5])}</span>
            <span class=" textcolor_white" style="color: lightgray; font-size: 9px;">EUR</span>
        </div>
        <div class="hide account_id">${line[0]}</div>
        <div class="hide account_kind">${line[3]}</div>
    </div>
    `;
    let listrows = document.getElementsByClassName("listrow");
    for(let listrow of listrows) {
        let acc_selected;
        let acc_selected_kind;
        let acc_selected_name;
        let acc_selected_number;
        listrow.addEventListener("click", function(){
            acc_selected = this.getElementsByClassName("account_id")[0].innerHTML;
            acc_selected_kind = this.getElementsByClassName("account_kind")[0].innerHTML;
            acc_selected_name = this.getElementsByClassName("listitem_middle_top")[0].innerHTML;
            acc_selected_number = this.getElementsByClassName("listitem_middle_bottom")[0].innerHTML;
            sessionStorage.setItem(acc_id, acc_selected);
            sessionStorage.setItem(acc_kind, acc_selected_kind);
            sessionStorage.setItem(acc_name, acc_selected_name);
            sessionStorage.setItem(acc_number, acc_selected_number);
            console.log(acc_selected, acc_selected_kind, acc_selected_name, acc_selected_number);
            window.location.assign("account.html");
        });
    }
}

/**
 * last but not least, sum up the balances to one total..
 */
function updateBalance(){
    let balances = document.getElementsByClassName("balance");
    let total = document.getElementById("db_subtotal_amount");
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
            timer_msgbox_container.style.display = "block";
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