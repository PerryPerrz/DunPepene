"use strict";

const formulaire = document.querySelector("form");

//When the form is submitted.
formulaire.addEventListener("submit", function (event) {
    //Disable the form's sending.
    event.preventDefault();

    let email = document.querySelector('#email');
    let password = document.querySelector('#password');

    email.classList.remove("redBorder");
    password.classList.remove("redBorder");

    try {
        checkEmail(email);
        checkPassword(password);
    } catch (e) {
        if (e.name === "ErrorEmail") {
            email.classList.add("redBorder");
        } else if (e.name === "ErrorPassword") {
            password.classList.add("redBorder");
        } else {
            alert(e.message);
        }
        return;
    }

    //We send the datas to our API
    let body = {email: email.value, password: password.value}
    let params = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    };
    fetch("/signin", params)
        .then((response) => response.text())
        .then((json) => {
            if (json === "failure") {
                email.classList.add("redBorder");
                password.classList.add("redBorder");
                alert("Votre email ou votre mot de passe est invalide !");
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
});

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