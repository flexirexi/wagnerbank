document.addEventListener("DOMContentLoaded", function() {
    let login_form = document.getElementById("login_form");
    
    login_form.addEventListener("submit", function(event){
        event.preventDefault();
        
        let username= document.getElementById("username").value;
        let pw      = document.getElementById("pw").value;
        fetch_user(username, pw);

    })
})

function fetch_user(username, pw) {
    fetch("./assets/data/data_login.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;
        let user_id;
        let user_firstname;
        let user_lastname;
        console.log(username + " " + pw);
        
        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
            console.log(line);
            if(line[3] == username && line[4] == pw) {
                user_id         = line[0];
                user_firstname  = line[1];
                user_lastname   = line[2];
                alert(user_id + "\n" + user_firstname + "\n" + user_lastname + "\n" + username + "\n" + pw);
                return;
            }
        }
        alert("Wrong USERNAME or PASSWORD. Please try again.");
    });
}