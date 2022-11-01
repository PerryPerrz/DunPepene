"use strict";

//Getting the html elements we need to use.
const showDate = document.querySelector("#ShowDate");
const dayButton = document.querySelector("#DayButton");
const WeekButton = document.querySelector("#WeekButton");
const MonthButton = document.querySelector("#MonthButton");
const PrevButton = document.querySelector("#PrevButton");
const NextButton = document.querySelector("#NextButton");

const divCalendar = document.querySelector("#calendar");
const LogoutButton = document.querySelector("#LogOut");

window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});

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

//Function that log out the user.
LogoutButton.addEventListener("click", function (event) {
    //We reset the token here.
    localStorage.setItem("token", "");
    //We send the user to the login page.
    location.assign("/login");
})

//Function that returns the name of the month passed as a parameter (number 0-11).
function getMonthName(month) {
    switch (month) {
        case 0 :
            return "Janvier";
        case 1 :
            return "Février";
        case 2 :
            return "Mars";
        case 3 :
            return "Avril";
        case 4 :
            return "Mai";
        case 5 :
            return "Juin";
        case 6 :
            return "Juillet";
        case 7 :
            return "Août";
        case 8 :
            return "Septembre";
        case 9 :
            return "Octobre";
        case 10 :
            return "Novembre";
        case 11 :
            return "Décembre";
    }
}

//Function that returns the name of the day passed as a parameter (number 0-6).
function getDayName(day) {
    switch (day) {
        case 0 :
            return "Dimanche";
        case 1 :
            return "Lundi";
        case 2 :
            return "Mardi";
        case 3 :
            return "Mercredi";
        case 4 :
            return "Jeudi";
        case 5 :
            return "Vendredi";
        case 6 :
            return "Samedi";
    }
}

function nextMonth() {
    //We go to the next month
    if (currentDate.getMonth() === 11) { //If it is december, we add 1 to the year
        currentDate = new Date(currentDate.getFullYear() + 1, 0, currentDate.getDate());
    } else {
        if (currentDate.getDate() === 31 || ((currentDate.getDate() === 30 || currentDate.getDate() === 29) && currentDate.getMonth() === 0)) //If the day is a 31, we go to the last day of the next month (the 0th day of the 2nd next month).
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
        if (currentDate.getDate() === 31 || ((currentDate.getDate() === 30 || currentDate.getDate() === 29) && currentDate.getMonth() === 2)) //If the day is a 31, we go to the last day of the previous month (the 0th day of this month). Exceptions for January
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
            showDate.innerHTML = dayDisplay(currentDate);
            break;
        default :
            console.log("Erreur de version");
    }
    adjustCalendarData();
}

//Function that returns the string to display as the date for the week version.
function weekDisplay(date) {
    let firstDay = new Date(date);
    firstDay.setDate(date.getDay() === 0 ? date.getDate() - 7 : date.getDate() - (date.getDay() - 1));
    let lastDay = new Date(date);
    lastDay.setDate(date.getDay() === 0 ? date.getDate() : date.getDate() + (7 - date.getDay()));

    return "Du " + firstDay.getDate() + " " + getMonthName(firstDay.getMonth()) + " au " + lastDay.getDate() + " " + getMonthName(lastDay.getMonth()) + " " + date.getFullYear();
}

//Function that returns the string to display as the date for the day version.
function dayDisplay(date) {
    return getDayName(date.getDay()) + " " + date.getDate() + " " + getMonthName(date.getMonth()) + " " + date.getFullYear();
}


//Function that displays the calendar according to the version passed as a parameter.
function displayCalendar(version) {
    fetch("/calendar/show/" + version)
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
            adjustWeek();
            break;
        case "day":
            adjustDay();
            break;
        default :
            console.log("Erreur de version");
    }
}

function dateToJsonFormat(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}

//Function that adjusts the days on the month calendar to be shown in the correct position.
function adjustMonth() {
    cleanModalWindows();
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    //We retrieve the box where we will write the 1st day of the month.
    let firstBox = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

    //We retrieve the box where we will write the last day of the month.
    let lastBox = lastDay.getDate() + firstBox;

    //We fill the first boxes of the calendar (before firstBox) with blanks.
    for (let i = 1; i < firstBox; i++) {
        const td = document.querySelector("#Month" + i);
        td.innerHTML = "";
        td.classList.add("empty");
    }

    fetch("/account/getUsername?email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((username) => {
            //We retrieve the events of this month for this user.
            fetch("/calendar/month?date=" + dateToJsonFormat(currentDate) + "&user=" + username)
                .then((response) => response.text())
                .then((json) => {
                    //We get a json object containing the events of this month.
                    let jsonObj = JSON.parse(json);

                    //We create a hashmap that contains the events in this way -> "day of the month" : "indexes of the events in the json object".
                    let hashMap = new Map();
                    for (let i = 0; i < jsonObj.length; i++) {
                        let len_date = jsonObj[i]["date"].length;
                        if (hashMap.get(jsonObj[i]["date"].substring(len_date - 2, len_date)) === undefined)
                            hashMap.set(jsonObj[i]["date"].substring(len_date - 2, len_date), [i]);
                        else
                            hashMap.get(jsonObj[i]["date"].substring(len_date - 2, len_date)).push(i);
                    }
                    //We fill the boxes between the firstBox and the lastBox with the days of the month and the events for those days.
                    for (let i = firstBox; i < lastBox; i++) {
                        const td = document.querySelector("#Month" + i);
                        td.classList.remove("empty");
                        let day = (i - firstBox + 1);

                        let content = "";
                        //We check if there are any events this specific day, if so, we get them from the hashmap and the json object them and display them.

                        let today = new Date();
                        if (today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
                            //If we're today, we put a circle on the day's number.
                            content += '<div class="circle">' + day + '</div>';
                        } else {
                            content += day;
                        }

                        if (hashMap.get(String(day)) === undefined) {
                            td.innerHTML = content;
                        } else {
                            for (let j = 0; j < hashMap.get(String(day)).length; j++) {
                                content += '<button class="modal-open ' + jsonObj[hashMap.get(String(day))[j]]["color"] + 'Event" data-modal="modal' + jsonObj[hashMap.get(String(day))[j]]["id"] + '">' + jsonObj[hashMap.get(String(day))[j]]["title"] + '</button>';
                            }
                            td.innerHTML = content;
                        }
                    }

                    createModalWindows(jsonObj);
                    associateModalBtnsToWindows();
                })
        })

    //We fill the last boxes with the first days of the next month.
    let j = 1;
    for (let i = lastBox; i <= 42; i++) {
        const td = document.querySelector("#Month" + i);
        td.innerHTML = "" + j;
        td.classList.add("empty");
        j++;
    }
}

//Function that adjusts shows the events on the day calendar.
function adjustDay() {
    cleanModalWindows()

    fetch("/account/getUsername?email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((username) => {
            //We retrieve the events of this day for this user.
            fetch("/calendar/day?date=" + dateToJsonFormat(currentDate) + "&user=" + username)
                .then((response) => response.text())
                .then((json) => {
                    //We get a json object containing the events of this day.
                    let jsonObj = JSON.parse(json);

                    //We retrieve the events of the day before, in case they extend on this day.
                    let yesterday = new Date();
                    yesterday.setDate(currentDate.getDate() - 1);
                    fetch("/calendar/day?date=" + dateToJsonFormat(yesterday) + "&user=" + username)
                        .then((response2) => response2.text())
                        .then((json2) => {
                            //We get a json object containing the events of the day before.
                            let jsonObj2 = JSON.parse(json2);

                            //We create a hashmap that contains the events in this way -> "hour" : "indexes of the events in the json object".
                            let hashMap = new Map();
                            //We go through all of today's events and get them in the hashmap.
                            for (let i = 0; i < jsonObj.length; i++) {
                                let hours = getHoursOfEvent(Number(jsonObj[i]["start_time"]), Number(jsonObj[i]["duration"]));
                                hours.forEach(function (h) {
                                    if (hashMap.get(h) === undefined)
                                        hashMap.set(h, [i]);
                                    else
                                        hashMap.get(h).push(i);
                                })
                            }
                            //We go through all of yesterday's events and get them in the hashmap if they extend into today.
                            for (let i = 0; i < jsonObj2.length; i++) {
                                let hours2 = getHoursOfEvent(Number(jsonObj2[i]["start_time"]), Number(jsonObj2[i]["duration"]));
                                hours2.forEach(function (h) {
                                    if (h >= 24) {
                                        if (hashMap.get(h - 24) === undefined)
                                            hashMap.set(h - 24, [i]);
                                        else
                                            hashMap.get(h - 24).push(i);
                                    }
                                })
                            }

                            //We fill the calendar hour by hour
                            for (let i = 0; i <= 23; i++) {
                                const td = document.querySelector("#Day" + i);
                                //We check if there are any events this specific hour, if so, we get them from the hashmap and the json object them and display them.
                                if (hashMap.get(i) !== undefined) {
                                    let events = "";
                                    for (let j = 0; j < hashMap.get(i).length; j++) {
                                        if (jsonObj[hashMap.get(i)[j]] != null) {
                                            events += '<button class="modal-open ' + jsonObj[hashMap.get(i)[j]]["color"] + 'Event" data-modal="modal' + jsonObj[hashMap.get(i)[j]]["id"] + '">' + jsonObj[hashMap.get(i)[j]]["title"] + '</button>';
                                        } else if (jsonObj2[hashMap.get(i)[j]] != null) {
                                            events += '<button class="modal-open ' + jsonObj2[hashMap.get(i)[j]]["color"] + 'Event" data-modal="modal' + jsonObj2[hashMap.get(i)[j]]["id"] + '">' + jsonObj2[hashMap.get(i)[j]]["title"] + '</button>';
                                        } else {
                                            console.log("UNKNOWN ERROR");
                                        }
                                    }
                                    td.innerHTML = events;
                                } else {
                                    td.innerHTML = "";
                                }
                            }

                            createModalWindows(jsonObj);
                            createModalWindows(jsonObj2);
                            associateModalBtnsToWindows();
                        })
                })
        })
}

//Function that adjusts shows the events on the week calendar.
function adjustWeek() {
    fetch("/account/getUsername?email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((username) => {
            //We retrieve the events of this week for this user.
            fetch("/calendar/week?date=" + dateToJsonFormat(currentDate) + "&user=" + username)
                .then((response) => response.text())
                .then((json) => {
                    //We get a json object containing the events of this week.
                    let jsonObj = JSON.parse(json);

                    //We create a hashmap that contains the events in this way -> ("day of the week-hour") : "indexes of the events in the json object".
                    let hashMap = new Map();
                    for (let i = 0; i < jsonObj.length; i++) {
                        let dayOfTheWeek = new Date(jsonObj[i]["date"]).getDay();

                        let dayAfter = dayOfTheWeek + 1;

                        let hours = getHoursOfEvent(Number(jsonObj[i]["start_time"]), Number(jsonObj[i]["duration"]));
                        hours.forEach(function (h) {
                            //We handle the fact that an event can be spread on 2 days.
                            let key = dayOfTheWeek + "-" + h;
                            if (h >= 24) {
                                key = dayAfter + "-" + (h - 24);
                            }

                            if (hashMap.get(key) === undefined)
                                hashMap.set(key, [i]);
                            else
                                hashMap.get(key).push(i);
                        })
                    }

                    //We fill the calendar day by day and hour by hour
                    for (let day = 0; day <= 6; day++) {
                        for (let hour = 0; hour <= 23; hour++) {
                            const td = document.querySelector("#Week" + getWeekId(day) + hour);
                            //We check if there are any events this specific hour, if so, we get them from the hashmap and the json object them and display them.
                            if (hashMap.get(day + "-" + hour) !== undefined) {
                                let events = "";
                                for (let j = 0; j < hashMap.get(day + "-" + hour).length; j++) {
                                    events += '<button class="modal-open ' + jsonObj[hashMap.get(day + "-" + hour)[j]]["color"] + 'Event" data-modal="modal' + jsonObj[hashMap.get(day + "-" + hour)[j]]["id"] + '">' + jsonObj[hashMap.get(day + "-" + hour)[j]]["title"] + '</button>';
                                }
                                td.innerHTML = events;
                            } else {
                                td.innerHTML = "";
                            }
                        }
                    }

                    createModalWindows(jsonObj);
                    associateModalBtnsToWindows();
                })
        })
}

//Function that returns the id of the day of the week passed as a parameter.
function getWeekId(day) {
    let res = "";
    switch (day) {
        case 0:
            res = "Sun";
            break;
        case 1:
            res = "Mon";
            break;
        case 2:
            res = "Tue";
            break;
        case 3:
            res = "Wed";
            break;
        case 4:
            res = "Thu";
            break;
        case 5:
            res = "Fri";
            break;
        case 6:
            res = "Sat";
            break;
    }
    return res;
}

//Function that returns an array containing all the hours of the event
function getHoursOfEvent(start_time, duration) {
    let hours = [];
    for (let i = start_time; i < start_time + duration; i++) {
        hours.push(i);
    }
    return hours;
}

//Function that associates the modal buttons to their respective modal windows
function associateModalBtnsToWindows() {

    //We get the buttons opening the windows and associate them with their modal windows
    let modalBtns = document.querySelectorAll(".modal-open");
    modalBtns.forEach(function (btn) {
        btn.onclick = function () {
            let modal = btn.getAttribute('data-modal');

            document.getElementById(modal).style.display = 'block';

            //Disable the page's scrolling whilst the modal window is open.
            const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}`;
        }
    })

    //We get the buttons closing the windows and associate them with their modal windows
    let closeBtns = document.querySelectorAll('.modal-close');
    closeBtns.forEach(function (btn) {
        btn.onclick = function () {
            btn.closest(".modal").style.display = "none";

            //Enable the page's scrolling whilst the modal window is close.
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    })

    //We make it so that a click outside the modal window closes it.
    window.onclick = function (e) {
        if (e.target.className === "modal") {
            e.target.style.display = "none";

            //Enable the page's scrolling whilst the modal window is close.
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }
}

//Function that creates the modal windows based on the events' information
function createModalWindows(jsonObj) {
    //Getting the div that will contain the modal windows
    const container = document.querySelector("#modal-windows");
    let modalWindows = "";

    //Creating the windows with the events' information inside them.
    for (let i = 0; i < jsonObj.length; i++) {
        modalWindows += '<div class="modal" id="modal' + jsonObj[i]["id"] + '">\n' +
            '    <div class="modal-content">\n' +
            '        <div class="modal-header ' + jsonObj[i]["color"] + 'Text">' + jsonObj[i]["title"] + '\n' +
            '            <button class="icon modal-close"><i class="material-icons">close</i></button>\n' +
            '        </div>\n' +
            '        <div class="modal-body">\n' +
            '           ' + jsonObj[i]["description"] + '<br>' +
            'Date : ' + dayDisplay(new Date(jsonObj[i]["date"])) + '<br>' +
            'Début : ' + jsonObj[i]["start_time"] + ' h' + '<br>' +
            'Durée : ' + jsonObj[i]["duration"] + ' h' + '<br>' +
            'Importance : ' + getImportance(jsonObj[i]["color"]) +
            '        </div>\n' +
            '        <div class="modal-footer">\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';
    }

    container.innerHTML += modalWindows;
}

//Function that cleans the div containing the modal windows
function cleanModalWindows() {
    const container = document.querySelector("#modal-windows");
    container.innerHTML = "";
}

//Function that returns the importance of an event based on its color
function getImportance(color) {
    let res = "";
    switch (color) {
        case "red":
            res = "Très important !";
            break;
        case "orange":
            res = "Important";
            break;
        case "yellow":
            res = "Assez important";
            break;
        case "green":
            res = "Peu important...mais nécessaire !";
            break;
    }
    return res;
}

//Function that returns the username of the user currently logged in
function getLoggedInUser() {
    try {
        let token = localStorage.getItem('token');
        let encodedEmail = token.split('.')[1];
        let decodedEmail = JSON.parse(window.atob(encodedEmail));
        return decodedEmail.email;
    } catch (err) {
        alert("Vous devez vous connecter pour voir votre calendrier !")
        window.location.assign("/login");
    }
}