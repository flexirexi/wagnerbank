const user_id = "id", user_first = "user_firstname", user_last = "user_lastname";

document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);

    alert(sessionStorage.getItem(user_first) + " " + sessionStorage.getItem(user_last) + ": " + sessionStorage.getItem(user_id));
    
})