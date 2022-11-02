"use strict";

//Getting the html elements we need to use.
const firstButton = document.querySelector("#firstButton");
const secondButton = document.querySelector("#secondButton");

//Si l'utilisateur n'est pas connecté, on affiche les boutons correspondants.
if (localStorage.getItem("token") === "" || localStorage.getItem("token") === null) {
    displayGuestButton();
} else {
    //We first check if the user logged in still exists in the database or if the jwt token is still correct.
    fetch("/account/getUsername?email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((username) => {
            //If the request tells us that there is no account with the email of the logged-in user, the access is unauthorized.
            if (username === "failure") {
                throw new Error();
            }

            //Otherwise, we display the homepage for a logged-in user
            displayMemberButtons();
        }).catch(() => {
        displayGuestButton();
    });
}



function displayGuestButton() {
    firstButton.innerHTML = "Inscription";
    firstButton.addEventListener("click", () => {
        location.assign("/register");
    })

    secondButton.innerHTML = "Connexion";
    secondButton.addEventListener("click", () => {
        location.assign("/login");
    })
}

function displayMemberButtons(){
    firstButton.innerHTML = "Calendrier";
    firstButton.addEventListener("click", () => {
        location.assign("/calendar");
    })

    secondButton.innerHTML = "Déconnexion";
    secondButton.addEventListener("click", () => {
        //We reset the token here.
        localStorage.removeItem("token");
        cleanDateAndVersion();
        //We reload the page.
        location.reload();
    })
}

//Function that returns the email of the user currently logged in
function getLoggedInUser() {
    try {
        let token = localStorage.getItem('token');
        let encodedEmail = token.split('.')[1];
        let decodedEmail = JSON.parse(window.atob(encodedEmail));
        return decodedEmail.email;
    } catch (err) {
        window.location.assign("/401");
    }
}

//Function that cleans the localStorage of the date and version.
function cleanDateAndVersion() {
    sessionStorage.removeItem('date');
    sessionStorage.removeItem('version');
}