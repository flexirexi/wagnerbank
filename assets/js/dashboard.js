document.addEventListener("DOMContentLoaded", function () {
    //alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);

    alert(sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname") + ": " + sessionStorage.getItem("id"));
})