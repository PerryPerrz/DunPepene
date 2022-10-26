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

    try {
        checkUsername(username);
        checkEmail(email);
        checkPassword(password);
        checkPassword(confirmPassword);
    }catch (e) {
        //TODO : gérer l'erreur pour changer le css/html (texte en rouge etc...).
        alert(e.message);
        return;
    }

    if (password.value !== confirmPassword.value) {
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
            .then((text) => (console.log(text)));
    }
});

function checkUsername(username) {
    // Tests if fields are filled and if values matches the regex.
    if (username.value === "") {
        throw new Error("Indiquez un nom d'utilisateur !");
    } else if (!username.value.match("^[a-zA-Z]{4,}$")) {
        throw new Error("Le nom d'utilisateur ne correspond pas au modèle requis !");
    }
}

function checkEmail(email) {
    // Tests if fields are filled and if values matches the regex.
    if (email.value === "") {
        throw new Error("Indiquez un email !");
    } else if (!email.value.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
        throw new Error("Le mail ne correspond pas au modèle necéssaire !");
    }
}

function checkPassword(password) {
    // Tests if fields are filled and if values matches the regex.
    if (password.value === "") {
        throw new Error("Sélectionner un password !");
    } else if (!password.value.match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")) {
        throw new Error("Le mot de passe ne correspond pas au modèle necéssaire !");
    }
}