document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);

    alert(localStorage.getItem("firstname") + " " + localStorage.getItem("lastname") + ": " + localStorage.getItem("id"));
})