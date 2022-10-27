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
                    showDate.innerHTML = currentDate.toDateString();
            })
})

//Setting up the button that switches the display of the calendar to the week display.
WeekButton.addEventListener("click", function (event) {
        fetch("/calendar/show/week")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    showDate.innerHTML = weekDisplay(currentDate);
            })
})

//Setting up the button that switches the display of the calendar to the month display.
MonthButton.addEventListener("click", function (event) {
        fetch("/calendar/show/month")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    showDate.innerHTML = getMonthName(currentDate.getMonth()) + " " + currentDate.getFullYear().toString();
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

function weekDisplay(date) {
    // Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to the nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to the nearest Thursday
    let weekNo =  Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return "week " + weekNo + " of " + date.getFullYear() + " (" + getMonthName(date.getMonth()) + ")" ; //TODO : changer en "du x(jour) au x(jour) y(mois).
}


