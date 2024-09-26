const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id", acc_kind = "account_kind";
const action="action";

document.addEventListener("DOMContentLoaded", function () {
    let move_container = document.getElementById("send_receiver_container");
    let send_container = document.getElementById("send_receiver2_container");
    let move_input = document.getElementById("send_receiver_dropdown");
    let send_input = document.getElementById("send_receiver2_input");
    let logout = document.getElementById("logout");
    let send_form = document.getElementById("send_form");
    let send_receiver_dropdown = document.getElementById("send_receiver_dropdown");
    let obj_sender_id = document.getElementById("send_sender_id");
    
    obj_sender_id.innerHTML = sessionStorage.getItem(acc_id);
    setupDropdown(send_receiver_dropdown);
    send_form.addEventListener("submit", submit);
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

function setupDropdown(send_receiver_dropdown) {
    fetch("./assets/data/data_accounts.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;
        let receivers = {};

        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if (line[1] == sessionStorage.getItem(user_id) &&
                line[3] != "credit card") {
                    send_receiver_dropdown.innerHTML += `<option class="option" value="${line[0]}">${line[4]} [${line[2]}]: \n ${line[5]} €</option>`
                    receivers[line[0]] = line[2];
            }
        }

        send_receiver_dropdown.addEventListener("change", function(){
            document.getElementById("send_receiver_id").innerHTML = this.value;
            document.getElementById("send_receiver_name").innerHTML = receivers[this.value];
        })
    });
}

function submit(event){
    let sender, sender_id, receiver, receiver_id, amount, ref;
    let obj_sender = document.getElementById("send_sender_image_top");
    event.preventDefault();

    //getConfirmation();
    sender = obj_sender.innerHTML;
    sender_id = sessionStorage.getItem(acc_id);
    if(sessionStorage.getItem(action)=="move"){
        receiver = document.getElementById("send_receiver_name").innerHTML;
        receiver_id = document.getElementById("send_receiver_id").innerHTML;
        
    } else {
        
        receiver = document.getElementById("send_receiver2_input").value;
        receiver_id = "";
    }
    amount = document.getElementById("send_amount_input").value;
    ref = document.getElementById("send_ref_input").value;
    alert("SEND: " + sender_id + ", " + receiver + ", " + amount + ", " + ref);

    let send_result = addTransaction(sender_id, receiver, amount, ref); //+account balance in data_accounts
    if(sessionStorage.getItem(action)=="move"){
        alert("MOVE: " + receiver_id + ", " + sender + ", " + amount + ", " + ref);
        let move_result = addTransaction(receiver_id, sender, amount*-1, ref); //+account balance in data_accounts
    }
    //sucessMessage(send_result, move_result);
}

async function addTransaction(acc_id, acc_ext, amount, ref) {
    // COPY and modified from https://dev.to/tienbku/javascript-fetch-getpostputdelete-example-3dmp ------- >
    const options = {
        method: "get",
        headers: {
            "Content-Type": "text/csv",
        }
    };
    
        const response = await fetch("./assets/data/data_account_trnsx.csv", options);
        if(!response.ok) {
            const message = "Error with status code " + response.status;
            throw new Error(message); 
        }
        let data = await response.text();
        console.log(data);

        data += "\n" + "haahhahahahahahahahahahahahahaha";
        sessionStorage.setItem("data", data);
        return;
        const options_update = {
            method: "post",
            headers: {
                "Content-Type": "text/csv",
                "Cache-Control": "no-cache"
            },
            body: data
        };
        const response_update = await fetch("./assets/data/data_account_trnsx_copy.csv", options_update);
        if(!response_update.ok) {
            const message_update = "Writing Error with status code " + response_update.status;
            throw new Error(message_update);
        }
        console.log("updated successfully");
    
    //END COPY from dev.to -> way more "elegant" than my previous fetch solutions... ---------------------->

    


}

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