import {global_user} from "./index.js"; 

document.addEventListener("DOMContentLoaded", function(){
    alert(global_user.firstname + " " + global_user.lastname + ": " + global_user.id);
})