var user_id;
var user_firstname;
var user_lastname;
var username;
var pw;

function login(username, pw) {
    fetch("./assets/data/data_login.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        let line;

        console.log(username + " " + pw);
        
        for (let i = 0; i < lines.length; i++) {
            line = lines[i].split(";");
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