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
    let dataset = fetch("./assets/data/data_login.csv").then(response => response.text()).then(data => {
        let lines = data.split("\n");
        data = [];

        for (let i = 0; i < lines.length; i++) {
            data[i] = lines[i].split(";");
        }

        return data;
    });
    
    alert(dataset);
}