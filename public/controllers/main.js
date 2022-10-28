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

displayCalendar(currentVersion);

//Setting up the button that switches the display of the calendar to the day display.
dayButton.addEventListener("click", function (event) {
        displayCalendar("day");
})

//Setting up the button that switches the display of the calendar to the week display.
WeekButton.addEventListener("click", function (event) {
        displayCalendar("week");
})

//Setting up the button that switches the display of the calendar to the month display.
MonthButton.addEventListener("click", function (event) {
        displayCalendar("month");
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
    //We go to the previous month
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

//Function that refreshes the date shown the page, the display depends on the current version of the calendar.
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
    adjustCalendarData();
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

//Function that displays the calendar according to the version passed as a parameter.
function displayCalendar(version) {
    fetch("/calendar/show/"+ version)
        .then((response) => response.text())
        .then((html) => {
            divCalendar.innerHTML = html;
            currentVersion = version;
            refreshShownDate();
        })
}

//Function that adjusts the data shown on the calendar according to the date and the events
function adjustCalendarData() {
    switch (currentVersion) {
        case "month":
            adjustMonth();
            break;
        case "week":
            break;
        case "day":
            break;
        default :
            console.log("Erreur de version");
    }
}

function dateToJsonFormat(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1)  + "-" + date.getDate();
}

//Function that adjusts the days on the month calendar to be shown in the correct position.
function adjustMonth() {
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    //We retrieve the box where we will write the 1st day of the month.
    let firstBox = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

    //We retrieve the box where we will write the last day of the month.
    let lastBox = lastDay.getDate() + firstBox;

    //We fill the first boxes of the calendar (before firstBox) with blanks.
    for(let i = 1; i < firstBox; i++) {
        const td = document.querySelector("#Month"+i);
        td.innerHTML = "";
    }

    //We retrieve the events of this month for this user.
    fetch("/calendar/month?date="+dateToJsonFormat(currentDate)+"&user=Hugo")
        .then((response) => response.text())
        .then((json) => {
            //We get a json object containing the events of this month.
            let jsonObj = JSON.parse(json);

            //We create a hashmap that contains the events in this way "day of the month" : "indexes of the events in the json object".
            let hashMap = new Map();
            for (let i = 0; i < jsonObj.length; i++) {
                if (hashMap.get(jsonObj[i]["date"].substring(8, 10)) === undefined)
                    hashMap.set(jsonObj[i]["date"].substring(8, 10), [i]);
                else
                    hashMap.get(jsonObj[i]["date"].substring(8, 10)).push(i);
            }
            //We fill the boxes between the firstBox and the lastBox with the days of the month and the events for those days.
            for (let i = firstBox; i < lastBox ; i++) {
                const td = document.querySelector("#Month"+i);
                let day = (i - firstBox + 1);

                //We check if there are any events this specific day, if so, we get them from the hashmap and the json object them and display them.
                if (hashMap.get("" + day) === undefined) {
                    td.innerHTML = "" + day;
                } else {
                    let events = "";
                    for(let j = 0; j < hashMap.get("" + day).length; j++)
                        events += "<br>" + jsonObj[hashMap.get("" + day)[j]]["title"] + " " + jsonObj[hashMap.get("" + day)[j]]["start_time"] + "h";
                    td.innerHTML = "" + day + events ;
                }
            }
        })



    //We fill the last boxes with the first days of the next month.
    let j = 1;
    for (let i = lastBox; i <= 42; i++) {
        const td = document.querySelector("#Month"+i);
        td.innerHTML = "" + j;
        j++;
    }

}