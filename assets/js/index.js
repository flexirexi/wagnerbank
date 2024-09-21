var global_user_id;
var global_user_firstname;
var global_user_lastname;
export {global_user_id};

document.addEventListener("DOMContentLoaded", function() {
    let login_form = document.getElementById("login_form");
    
    login_form.addEventListener("submit", function(event){
        event.preventDefault();
        
        let username= document.getElementById("username").value;
        let pw      = document.getElementById("pw").value;
        login(username, pw);

    })
})

function login(login_username, login_pw) {
    fetch("./assets/data/data_login.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;
        
        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            if(line[3] == login_username && line[4] == login_pw) {
                global_user_id         = line[0];
                global_user_firstname  = line[1];
                global_user_lastname   = line[2];
                alert(`Welcome back to Wagner Bank, ${global_user_firstname} ${global_user_lastname}! \n` + global_user_id + "\n" + global_user_firstname + "\n" + global_user_lastname);
                window.location.assign("dashboard.html");
                return;
            }
        }
        alert("Wrong USERNAME or PASSWORD. Please try again.");
        return;
    });
    return;
}

