"use strict";

const formulaire = document.querySelector("form");

//When the form is submitted.
formulaire.addEventListener("submit", function (event) {
    //Disable the form's sending.
    event.preventDefault();

    let username = document.querySelector('#username');
    let email = document.querySelector('#email');
    let password = document.querySelector('#password');
    let confirmPassword = document.querySelector('#confirm_password');

    username.classList.remove("redBorder")
    email.classList.remove("redBorder");
    password.classList.remove("redBorder");
    confirmPassword.classList.remove("redBorder");

    try {
        checkUsername(username);
        checkEmail(email);
        checkPassword(password);
        checkPassword(confirmPassword);
    } catch (e) {
        console.log(e, e.name)
        if (e.name === "ErrorEmail") {
            email.classList.add("redBorder");
        } else if (e.name === "ErrorPassword") {
            password.classList.add("redBorder");
            confirmPassword.classList.add("redBorder");
        } else if (e.name === "ErrorUsername") {
            username.classList.add("redBorder");
        } else {
            alert(e.message);
        }
        return;
    }

    if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add("redBorder");
        alert("Les mots de passes doivent correspondre !")
    } else {
        //We send the datas to our API
        let body = {username: username.value, email: email.value, password: password.value}
        let params = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        };
        fetch("/signup", params)
            .then((response) => response.text())
            .then((json) => {
                if (json === "failure") {
                    email.classList.add("redBorder");
                    alert("Email déjà utilisé !");
                } else if (json === "error") {
                    throw new Error("Mauvaise requête");
                } else {
                    //We store the token in the browser's local storage.
                    let jsonObj = JSON.parse(json);
                    localStorage.setItem("token", jsonObj["accessToken"]);
                    //We redirect the user to the index page.
                    location.assign("/");
                }
            }).catch((err) => {
            console.log(err);
        });
    }
});

function checkUsername(username) {
    // Tests if fields are filled and if values matches the regex.
    if (username.value === "") {
        throw new ErrorUsername("Indiquez un nom d'utilisateur !");
    } else if (!username.value.match("^[a-zA-Z]{4,}$")) {
        throw new ErrorUsername("Le nom d'utilisateur ne correspond pas au modèle requis !");
    }
}

function checkEmail(email) {
    // Tests if fields are filled and if values matches the regex.
    if (email.value === "") {
        throw new ErrorEmail("Indiquez un email !");
    } else if (!email.value.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
        throw new ErrorEmail("Le mail ne correspond pas au modèle necéssaire !");
    }
}

function checkPassword(password) {
    // Tests if fields are filled and if values matches the regex.
    if (password.value === "") {
        throw new ErrorPassword("Sélectionner un password !");
    } else if (!password.value.match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")) {
        throw new ErrorPassword("Le mot de passe ne correspond pas au modèle necéssaire !");
    }
}

// Exception thrown when the email isn't in lin with our model.
function ErrorEmail(message) {
    this.message = message;
    this.name = "ErrorEmail";
}

// Exception thrown when the email isn't in lin with our model.
function ErrorPassword(message) {
    this.message = message;
    this.name = "ErrorPassword";
}

// Exception thrown when the username isn't in lin with our model.
function ErrorUsername(message) {
    this.message = message;
    this.name = "ErrorUsername";
}