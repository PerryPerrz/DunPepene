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

    // Tests if fields are filled and if values matches the regex.
    if (username.value === "") {
        alert("Indiquez un nom d'utilisateur !");
        return
    } else if (!username.value.match("^[a-zA-Z]{4,}$")) {
        alert("Le nom d'utilisateur ne correspond pas au modèle requis !");
        return
    }

    if (email.value === "") {
        alert("Indiquez un email !");
        return
    } else if (!email.value.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
        alert("Le mail ne correspond pas au modèle requis !");
        return
    }

    if (password.value === "") {
        alert("Sélectionner un mot de passe !");
        return
    } else if (!password.value.match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")) {
        alert("Le mot de passe ne correspond pas au modèle requis !");
        return
    }

    if (confirmPassword.value === "") {
        alert("Indiquez une confirmation de mot de passe !");
        return
    } else if (!confirmPassword.value.match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")) {
        alert("La confirmation de mot de passe ne correspond pas au modèle requis !");
        return
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
