"use strict";

//Getting the html elements we need to use.
const showDate = document.querySelector("#ShowDate");
const dayButton = document.querySelector("#DayButton");
const WeekButton = document.querySelector("#WeekButton");
const MonthButton = document.querySelector("#MonthButton");
const PrevButton = document.querySelector("#PrevButton");
const NextButton = document.querySelector("#NextButton");

const divCalendar = document.querySelector("#calendar");


//We get the current date.
let currentDate = new Date();
showDate.innerHTML = currentDate.toDateString();

//Value : "month", "week" or "day"
let currentVersion = "month";

//Setting up the button that switches the display of the calendar to the day display.
dayButton.addEventListener("click", function (event) {
        fetch("/calendar/show/day")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    currentVersion = "day";
                    refreshShownDate();
            })
})

//Setting up the button that switches the display of the calendar to the week display.
WeekButton.addEventListener("click", function (event) {
        fetch("/calendar/show/week")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    currentVersion = "week";
                    refreshShownDate();
            })
})

//Setting up the button that switches the display of the calendar to the month display.
MonthButton.addEventListener("click", function (event) {
        fetch("/calendar/show/month")
            .then((response) => response.text())
            .then((html) => {
                    divCalendar.innerHTML = html;
                    currentVersion = "month";
                    refreshShownDate();
            })
})

//Setting up the button that switches the display of the calendar to the previous day/week/month depending on the current view.
PrevButton.addEventListener("click", function (event) {
    switch (currentVersion) {
        case "month" :
            prevMonth();
            break;
        case "week" :
            prevWeek();
            break;
        case "day" :
            prevDay();
            break;
        default :
            console.log("Erreur de version");
    }
    refreshShownDate();
})

//Setting up the button that switches the display of the calendar to the next day/week/month depending on the current view.
NextButton.addEventListener("click", function (event) {
    switch (currentVersion) {
        case "month" :
            nextMonth();
            break;
        case "week" :
            nextWeek();
            break;
        case "day" :
            nextDay();
            break;
        default :
            console.log("Erreur de version");
    }
    refreshShownDate();
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

function nextMonth() {
    //We go to the next month
    if (currentDate.getMonth() === 11) { //If it is december, we add 1 to the year
        currentDate = new Date(currentDate.getFullYear() + 1, 0, currentDate.getDate());
    } else {
        if (currentDate.getDate() === 31) //If the day is a 31, we go to the last day of the next month (the 0th day of the 2nd next month).
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
        else
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
    }
}

function nextWeek() {
    currentDate.setDate(currentDate.getDate() + 7);
}

function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
}

function prevMonth() {
    //We go to the next month
    if (currentDate.getMonth() === 0) { //If it is december, we add 1 to the year
        currentDate = new Date(currentDate.getFullYear() - 1, 11, currentDate.getDate());
    } else {
        if (currentDate.getDate() === 31) //If the day is a 31, we go to the last day of the previous month (the 0th day of this month).
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        else
            currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    }
}

function prevWeek() {
    currentDate.setDate(currentDate.getDate() - 7);
}

function prevDay() {
    currentDate.setDate(currentDate.getDate() - 1);
}

//Function that refreshes the date shown on top of the page, the display depends on the current version of the calendar.
function refreshShownDate() {
    switch (currentVersion) {
        case "month":
            showDate.innerHTML = getMonthName(currentDate.getMonth()) + " " + currentDate.getFullYear().toString();
            break;
        case "week" :
            showDate.innerHTML = weekDisplay(currentDate);
            break;
        case "day" :
            showDate.innerHTML = currentDate.toDateString();
            break;
        default :
            console.log("Erreur de version");
    }
}

//Function that returns the string to display as the date for the week version.
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
