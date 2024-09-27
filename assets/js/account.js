const user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id", acc_kind = "account_kind";
const action="action";

document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);
    let logout = document.getElementById("logout");
    let send = document.getElementById("acc_send");
    let send2 = document.getElementById("acc_send_btn");
    let move = document.getElementById("acc_move_btn");
    let move2 = document.getElementById("acc_move");
    let back_btn = document.getElementById("nav_bar_left_btn");

    back_btn.addEventListener("click", function(){loadPreviousPage();});
    logout.addEventListener("click", logout_user);
    if(sessionStorage.getItem(acc_kind)=="credit card"){
        send.style.display="none";
        send2.style.display="none";
        move.style.display="none";
        move2.style.display="none";
    } else {
        send.addEventListener("click", loadSend);
        send2.addEventListener("click", loadSend);
        move.addEventListener("click", loadMove);
        move2.addEventListener("click", loadMove);
    }
    startCountdown();
    addNameToNavBar();
    fillWebsite();
});

function loadMove() {
    sessionStorage.setItem(action, "move");
    window.location.assign("send.html");
}

function loadSend(){
    sessionStorage.setItem(action, "send");
    window.location.assign("send.html");
}

function logout_user(){
    sessionStorage.clear();
    window.location.replace("index.html");
    alert("clear sessionstorage");
}

function addNameToNavBar() {
    let span = document.getElementById("nav_bar_right_text");
    span.innerHTML = `Hello, ${sessionStorage.getItem(user_first)} ${sessionStorage.getItem(user_last)}!`;
}

function loadPreviousPage(){
    window.location.assign("dashboard.html");
}

function fillWebsite() {
    if(sessionStorage.getItem("data")==null) {
        fetch("./assets/data/data_account_trnsx.csv").then(response => response.text()).then(data => {
            sessionStorage.setItem("data", data);
            //console.log(sessionStorage.getItem("data"));
            //console.log(data);
             fillList(data);
        });
    } else {
        fillList(sessionStorage.getItem("data"));
    }
}

function fillList(data){
    let listContainer = document.getElementById("acc_table_container");
    let menu_btn = document.getElementsByClassName("acc_dropdown")[0];
    let lines = [];

    lines = data.split("\r\n");
    for(let i=0; i<lines.length; i++) {
        lines[i] = lines[i].split(";");
    }
    lines = lines.sort((a,b) => new Date(b[4]) - new Date(a[4]));

    
    menu_btn.addEventListener("click", function(){
        let dropdown_content = document.getElementsByClassName("acc_dropdown-content")[0];
        dropdown_content.style.display == "block" ? dropdown_content.style.display = "none" : dropdown_content.style.display = "block";
    });
    
    listContainer.innerHTML = "";
    for (let i = 1; i < lines.length; i++) {
        if (i==0){
        } else if (lines[i][1] == sessionStorage.getItem(acc_id)) {
            updateBalance(lines[i]);
            addRow(listContainer, lines[i]);               
        }
    }
   
}

function addRow(listContainer, line){
    if(line[7]==""){return;}
    listContainer.innerHTML += `
    <div class="acc_listrow background_lblue">
        <div class="acc_listitem_left textcolor_white"> ${line[4].split(" ")[1].slice(8,10) + "/" + line[4].split(" ")[1].slice(5,7)} </div>
        <div class="acc_listitem_middle">
            <div class="acc_listitem_middle_top no_wrap textcolor_white font_cinzelc">${line[8]}</div>
            <div class="acc_listitem_middle_bottom no_wrap textcolor_white no_wrap ">${line[9]}</div>
        </div>
        <div class="acc_listitem_right">
            <span class="balance textcolor_white no_wrap">${new Intl.NumberFormat('no', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(line[7])}</span>
            
        </div>
    </div>
    `;
}

function updateBalance(line){
    let balance = document.getElementById("acc_subtotal_amount");
    if(balance.innerHTML==""){
        balance.innerHTML = new Intl.NumberFormat('no', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(line[10]);
    }
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