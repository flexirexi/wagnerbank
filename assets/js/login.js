document.addEventListener("DOMContentLoaded", function() {
    let bt_login = document.getElementById("login_button");
    
    bt_login.addEventListener("submit", function(event) {
        event.preventDefault();
        alert("hallo");
        let username= document.getElementById("username").value;
        let pw      = document.getElementById("pw").value;
        fetch_user(username, pw);

    })
})

function fetch_user(username, pw) {
    alert("hallo");
    let dataset = fetch("./assets/data/dat_login.csv").then(response => response.text()).then(data => {return data;});
    alert(dataset);
}