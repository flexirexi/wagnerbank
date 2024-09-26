const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";
const acc_id = "account_id", acc_kind = "account_kind";
const action="action";

document.addEventListener("DOMContentLoaded", function () {
    let move_container = document.getElementById("send_receiver_container");
    let send_container = document.getElementById("send_receiver2_container");
    
    if(sessionStorage.getItem(action)=="move") {
        move_container.style.display = "flex";
        send_container.style.display = "none";
    } else {
        move_container.style.display = "none";
        send_container.style.display = "flex";
    }
})