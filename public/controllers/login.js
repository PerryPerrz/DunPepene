"use strict";

//const axios = require('axios');

const formulaire = document.querySelector("form");

//When the form is submitted.
formulaire.addEventListener("submit", function (event) {
    //Disable the form's sending.
    event.preventDefault();

    let email = document.querySelector('#email');
    let password = document.querySelector('#password');

    console.log(email.value);
    console.log(password.value);

    // Tests if fields are filled and if values matches the regex.
    if (email.value === "") {
        alert("Indiquez un email !");
    } else if (!email.value.match("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
        alert("Le mail ne correspond pas au modèle necéssaire !");
    }

    if (password.value === "") {
        alert("Sélectionner un password !");
    } else if (!password.value.match("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")) {
        alert("Le mot de passe ne correspond pas au modèle necéssaire !");
    }
});

