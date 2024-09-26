const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id", acc_kind = "account_kind";
const action="action";

document.addEventListener("DOMContentLoaded", function () {
    let move_container = document.getElementById("send_receiver_container");
    let send_container = document.getElementById("send_receiver2_container");
    let move_input = document.getElementById("send_receiver_dropdown");
    let send_input = document.getElementById("send_receiver2_input");
    let logout = document.getElementById("logout");
    
    logout.addEventListener("click", logout_user);
    if(sessionStorage.getItem(action)=="move") {
        move_container.style.display = "flex";
        send_container.style.display = "none";
        send_input.disabled = true;
        move_input.disabled = false;
        send_input.required = false;
        move_input.required = true;
        
    } else {
        move_container.style.display = "none";
        send_container.style.display = "flex";
        send_input.disabled = false;
        move_input.disabled = true;
        send_input.required = true;
        move_input.required = true;
    }
    startCountdown();
    addNameToNavBar();
})

function logout_user(){
    sessionStorage.clear;
    window.location.replace("index.html");
}

function addNameToNavBar() {
    let span = document.getElementById("nav_bar_right_text");
    span.innerHTML = `Hello, ${sessionStorage.getItem(user_first)} ${sessionStorage.getItem(user_last)}!`;
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