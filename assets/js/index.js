document.addEventListener("DOMContentLoaded", function() {

    let login_form = document.getElementById("login_form");
    
    login_form.addEventListener("submit", function(event){
        event.preventDefault();
        
        let username= document.getElementById("username").value;
        let pw      = document.getElementById("pw").value;
        login(username, pw);

    })
})

