const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id", acc_kind = "account_kind", acc_name = "account_name", acc_number = "account_number";
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
    let obj_sender_name = document.getElementById("send_sender_image_top");
    let obj_sender_acc_number = document.getElementById("send_sender_image_bottom");

    obj_sender_id.innerHTML = sessionStorage.getItem(acc_id);
    obj_sender_name.innerHTML = sessionStorage.getItem(acc_name);
    obj_sender_acc_number.innerHTML = sessionStorage.getItem(acc_number);
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
                    send_receiver_dropdown.innerHTML += `<option class="option" value="${line[0]}">${line[4]} [${line[0]}] [${line[2]}]: \n ${line[5]} €</option>`
                    receivers[line[0]] = [line[2],line[3]];
            }
        }

        send_receiver_dropdown.addEventListener("change", function(){
            document.getElementById("send_receiver_id").innerHTML = this.value;
            document.getElementById("send_receiver_name").innerHTML = receivers[this.value][0];
            document.getElementById("send_receiver_kind").innerHTML = receivers[this.value][1];
        })
    });
}

function submit(event){
    event.preventDefault();
    let sender, sender_id, receiver, receiver_id, receiver_kind, amount, ref;
    let obj_sender = document.getElementById("send_sender_image_top");
    
    //getConfirmation();
    sender = obj_sender.innerHTML;
    sender_id = sessionStorage.getItem(acc_id);
    if(sessionStorage.getItem(action)=="move"){
        receiver = document.getElementById("send_receiver_name").innerHTML;
        receiver_id = document.getElementById("send_receiver_id").innerHTML;
        receiver_kind = document.getElementById("send_receiver_kind").innerHTML;
    } else {
        
        receiver = document.getElementById("send_receiver2_input").value;
        receiver_id = "";
    }
    amount = Number(document.getElementById("send_amount_input").value) * -1;
    ref = document.getElementById("send_ref_input").value;
    if(!confirm("Please CHECK and CONFIRM: \n\nSender: " + sender + "\nReceiver: " + receiver + "\nAmount: " + amount*-1 + "\nReference: " + ref)) {
        return;
    }
    //alert("SEND: " + sender_id + ", " + receiver + ", " + amount + ", " + ref);

    addTransaction(sender_id, receiver, amount, ref, sessionStorage.getItem(acc_kind)); //+account balance in data_accounts
    if(sessionStorage.getItem(action)=="move"){
        amount *= -1;
        //alert("MOVE: " + receiver_id + ", " + sender + ", " + amount + ", " + ref);
        addTransaction(receiver_id, sender, amount, ref, receiver_kind); //+account balance in data_accounts
    }
    successMessage();
}

function successMessage() {
    let message_cont = document.getElementById("send_confirm_container");
    let btn = document.getElementById("send_confirm_btn");
    
    message_cont.style.display = "block";
    btn.addEventListener("click", function(){
        window.location.replace("account.html");
    })

}

function addTransaction(account_id, acc_ext, amount, ref, account_kind) {
    //was wir brauchen: trnsx_id, datum, zeit, balance as of today
    let trnsx_id = createTrnsxID();
    let trnsx_date_helper = new Date();
    let m = trnsx_date_helper.getMonth() + 1 
    m = m.toString().padStart(2, '0');
    let y = trnsx_date_helper.getFullYear();
    let d = trnsx_date_helper.getDate();
    d = d.toString().padStart(2, '0');
    let h = trnsx_date_helper.getHours();
    h = h.toString().padStart(2, '0');
    let mm = trnsx_date_helper.getMinutes();
    mm = mm.toString().padStart(2, '0');
    let s = trnsx_date_helper.getSeconds();
    s = s.toString().padStart(2, '0');
    let trnsx_time = h + ":" + mm;
    let trnsx_date = " " + y + "-" + m + "-" + d + " " + trnsx_time + ":" + s;
    alert("transaction date: " + trnsx_date);
    let balance = newBalance(account_id, amount);
    

    let data = sessionStorage.getItem("data");
    let row = `\r\n${trnsx_id};${account_id};${sessionStorage.getItem("id")};${account_kind};${trnsx_date};${trnsx_time};;${amount};${ref};${acc_ext};${balance};`
    data += row;
    sessionStorage.setItem("data", data);
    console.log(row);
    //100486;2013;1005;savings account; 2024-07-05 12:00;12:00:00;Fr;120.00;savings plan;;6705;
}

function newBalance(account_id, amount){
    let lines = readData("date_account", account_id);
    let balance = Number(lines[0][10]) + amount;
    balance = balance.toFixed(2);
    console.log("newBalance: " + lines[0][10] + " + " + amount + " = " + balance);
    return balance;
}

function createTrnsxID(){
    let lines = readData("trnsx_id");
    let trnsx_id = parseInt(lines[1][0]) + 1;
    return trnsx_id;
}

function readData(filter, account_id){
    let lines = [];
    lines = sessionStorage.getItem("data").split("\r\n");


    if(filter=="date_account"){
        console.log("----- filter by date -----");
        let lines_helper = lines;
        lines = [];
        for(let i=0; i<lines_helper.length; i++) {
            
            if(lines_helper[i].split(";")[1]==account_id) { 
                lines[lines.length] = lines_helper[i].split(";");
            }
        }
        lines = lines.sort((a,b) => new Date(b[4]) - new Date(a[4]));
        lines_helper = [];
        for(let i=0;i<4;i++){
            console.log(lines[i]);
        }
    } else if(filter=="trnsx_id"){
        console.log("----- filter by trnsx ID -----");
        for(let i=0; i<lines.length; i++) {
            lines[i] = lines[i].split(";");
            if(i<4){console.log(lines[i]);}
        }
        console.log(typeof lines);
        lines = lines.sort((a,b) => b[0] - a[0]);

    }
    return lines;
}

function logout_user(){
    sessionStorage.clear();
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