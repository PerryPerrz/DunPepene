"use strict";

//Getting the html elements we need to use.
const showDate = document.querySelector("#ShowDate");
const dayButton = document.querySelector("#DayButton");
const WeekButton = document.querySelector("#WeekButton");
const MonthButton = document.querySelector("#MonthButton");
const divCalendar = document.querySelector("#calendar");

//We get the current date.
let currentDate = new Date();
showDate.innerHTML = currentDate.toDateString();

//Setting up the button that switches the display of the calendar to the day display.
dayButton.addEventListener("click", function (event) {
        fetch("/calendar/show/day")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    showDate.innerHTML = currentDate.toDateString(); //TODO : améliorer l'affichage
            })
})

//Setting up the button that switches the display of the calendar to the week display.
WeekButton.addEventListener("click", function (event) {
        fetch("/calendar/show/week")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    showDate.innerHTML = currentDate.toDateString(); //TODO : améliorer l'affichage
            })
})

//Setting up the button that switches the display of the calendar to the month display.
MonthButton.addEventListener("click", function (event) {
        fetch("/calendar/show/month")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    showDate.innerHTML = getMonthName(currentDate.getMonth()) + " " + currentDate.getFullYear().toString(); //TODO : améliorer l'affichage (mois)
            })
})

//Function that returns the name of the month passed as a parameter (number 0-11).
function getMonthName(month) {
        switch (month) {
                case 0 :
                        return "January";
                case 1 :
                        return "February";
                case 2 :
                        return "March";
                case 3 :
                        return "April";
                case 4 :
                        return "May";
                case 5 :
                        return "June";
                case 6 :
                        return "July";
                case 7 :
                        return "August";
                case 8 :
                        return "September";
                case 9 :
                        return "October";
                case 10 :
                        return "November";
                case 11 :
                        return "December";
        }
}


