"use strict";

//Connecting to the websocket client
const ws = new WebSocket("ws://localhost:3030");

//When connected, we log that fact
ws.addEventListener('open', function (event) {
    console.log('Connection established to WebSocket server');
})

//When we receive a message, it means that the calendar data has changed so we refresh it.
ws.addEventListener('message',function (message) {
    //We need to parse the message because of buffering issues.
    let string_arr = JSON.parse(message['data']).data;
    let data = "";

    string_arr.forEach(element => {
        data+=String.fromCharCode(element);
    });

    //Once we have gotten the message data, if the user is concerned by the change, we refresh their data.
    if (data === getLoggedInUser())
        adjustCalendarData();
})

//Function used to send a notice to the WebSocket server when we change the calendar data.
const sendNotice = () => {
    ws.send(getLoggedInUser());
}

//Getting the html elements we need to use.
const showDate = document.querySelector("#ShowDate");
const dayButton = document.querySelector("#DayButton");
const WeekButton = document.querySelector("#WeekButton");
const MonthButton = document.querySelector("#MonthButton");
const PrevButton = document.querySelector("#PrevButton");
const NextButton = document.querySelector("#NextButton");

const divCalendar = document.querySelector("#calendar");
const homepageButton = document.querySelector("#HomePage");

if (localStorage.getItem("token") === "") {
    window.location.assign("/401");
}

//We first check if the user logged in still exists in the database or if the jwt token is still correct.
fetch("/account/getUsername?email=" + getLoggedInUser())
    .then((response) => response.text())
    .then((username) => {
        //If the request tells us that there is no account with the email of the logged-in user, the access is unauthorized.
        if (username === "failure") {
            throw new Error();
        }
    }).catch(() => {
    window.location.assign("/401");
});


//We listen to the scroll actions that the user takes to use it when we display modal windows.
window.addEventListener('scroll', () => {
    sessionStorage.setItem('scrollY', `${window.scrollY}px`);
});

let currentVersion = "";
let currentDate = null;
//We check if the user was already navigating the calendar, if so, we put them back where they were.
if (sessionStorage.getItem('version') == null) {
    currentVersion = "month";
} else {
    currentVersion = sessionStorage.getItem('version');
}
if (sessionStorage.getItem('date') == null) {
    //We get the current date.
    currentDate = new Date();
} else {
    currentDate = new Date(sessionStorage.getItem('date'));
}
showDate.innerHTML = currentDate.toDateString();

displayCalendar(currentVersion);

//Setting up the button that switches the display of the calendar to the day display.
dayButton.addEventListener("click", function () {
    displayCalendar("day");
})

//Setting up the button that switches the display of the calendar to the week display.
WeekButton.addEventListener("click", function () {
    displayCalendar("week");
})

//Setting up the button that switches the display of the calendar to the month display.
MonthButton.addEventListener("click", function () {
    displayCalendar("month");
})

//Setting up the button that switches the display of the calendar to the previous day/week/month depending on the current view.
PrevButton.addEventListener("click", function () {
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
            location.assign("/500");
    }
    refreshShownDate();
    sessionStorage.setItem('date', currentDate);
})

//Setting up the button that switches the display of the calendar to the next day/week/month depending on the current view.
NextButton.addEventListener("click", function () {
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
            location.assign("/500");
    }
    refreshShownDate();
    sessionStorage.setItem('date', currentDate);
})

//Function that log out the user.
homepageButton.addEventListener("click", function () {
    //We send the user to the home page.
    location.assign("/");
})

const formulaire = document.querySelector("#addEvent");

//When the form to add an event is submitted.
formulaire.addEventListener("submit", function (event) {
    //Disable the form's sending.
    event.preventDefault();

    const title = document.querySelector('#title');
    const description = document.querySelector('#description');
    const date = document.querySelector('#start-date');
    const start_time = document.querySelector('#start_time');
    const duration = document.querySelector('#duration');
    const color = document.querySelector('#color');

    const user_email = getLoggedInUser();
    //We get the username of the logged-in user.
    fetch("/account/getUsername?email=" + user_email)
        .then((response) => response.text())
        .then((username) => {
            //We send the datas to our API
            let body = {
                id: String(new Date().getTime()),
                owner: username,
                owner_email: user_email,
                title: title.value,
                description: description.value,
                date: date.value,
                start_time: start_time.value,
                duration: duration.value,
                color: color.value
            }
            let params = {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            };
            fetch("/events/add", params)
                .then((response) => response.text())
                .then((str) => {
                    if (str === "failure" || str === "error") {
                        alert("Une erreur est survenue lors de l'ajout d'un ??v??nement ! Veuillez recommencer")
                    }
                    //We notify the other users of the change
                    sendNotice();
                    //We redirect the user to the index page.
                    location.reload();
                });
        })
});


//Function that returns the name of the month passed as a parameter (number 0-11).
function getMonthName(month) {
    switch (month) {
        case 0 :
            return "Janvier";
        case 1 :
            return "F??vrier";
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
            return "Ao??t";
        case 8 :
            return "Septembre";
        case 9 :
            return "Octobre";
        case 10 :
            return "Novembre";
        case 11 :
            return "D??cembre";
        default :
            location.assign("/500");
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
        default :
            location.assign("/500");
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
            location.assign("/500");
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
    sessionStorage.setItem('version', currentVersion);
    cleanModalWindows();
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
            location.assign("/500");
    }
}

function dateToJsonFormat(date) {
    let monthNum = Number(date.getMonth() + 1);
    let dayNum = Number(date.getDate());
    let month = monthNum >= 10 ? "" + monthNum : "0" + monthNum;
    let day = dayNum >= 10 ? "" + dayNum : "0" + dayNum;
    return date.getFullYear() + "-" + month + "-" + day;
}

//Function that adjusts the days on the month calendar to be shown in the correct position.
function adjustMonth() {
    //We retrieve the first and last days of the month
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    //We retrieve the boxes where we will write the 1st and last days of the month.
    let firstBox = firstDay.getDay() === 0 ? 7 : firstDay.getDay();
    let lastBox = lastDay.getDate() + firstBox;

    //We fill the first boxes of the calendar (before firstBox) with blanks.
    fillWithBlanksMonth(firstBox);

    //We retrieve the events of this month for this user.
    fetch("/calendar/month?date=" + dateToJsonFormat(currentDate) + "&email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((json) => {
            //We get a json object containing the events of this month.
            let jsonObj = JSON.parse(json);

            //We create a hashmap that contains the events in this way -> "day of the month" : "indexes of the events in the json object".
            let hashMap = createHashMapMonth(jsonObj);

            //We fill the boxes between the firstBox and the lastBox with the days of the month and the events for those days.
            fillWithEventsMonth(firstBox, lastBox, hashMap, jsonObj);

            createModalWindows(jsonObj);
            associateModalBtnsToWindows();
        })

    //We fill the last boxes with the first days of the next month.
    fillWithDaysOfNextMonth(lastBox);
}

//Function that fills the first boxes of the calendar (before firstBox) with blanks.
function fillWithBlanksMonth(firstBox) {
    for (let i = 1; i < firstBox; i++) {
        const td = document.querySelector("#Month" + i);
        td.innerHTML = "";
        td.classList.add("empty");
    }
}

//Function that fills the last boxes of the calendar (after lastBox) with the days of the next month.
function fillWithDaysOfNextMonth(lastBox) {
    let j = 1;
    for (let i = lastBox; i <= 42; i++) {
        const td = document.querySelector("#Month" + i);
        td.innerHTML = "" + j;
        td.classList.add("empty");
        j++;
    }
}

//Function that creates the hashMap needed for the month version of the calendar.
function createHashMapMonth(jsonObj) {
    let hashMap = new Map();
    for (let i = 0; i < jsonObj.length; i++) {
        let day = jsonObj[i]["date"].split("-")[2];
        if (day.charAt(0) === '0')
            day = day.charAt(1);

        if (hashMap.get(day) === undefined)
            hashMap.set(day, [i]);
        else
            hashMap.get(day).push(i);
    }
    return hashMap;
}

//Function that fills the month version of the calendar with events, day by day.
function fillWithEventsMonth(firstBox, lastBox, hashMap, jsonObj) {
    for (let i = firstBox; i < lastBox; i++) {
        const td = document.querySelector("#Month" + i);
        td.classList.remove("empty");
        let day = (i - firstBox + 1);
        let content = "";

        //If we're today, we put a circle on the day's number.
        let today = new Date();
        if (today.getDate() === day && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
            content += '<div class="circle">' + day + '</div>';
        } else {
            content += day;
        }

        //We check if there are any events this specific day, if so, we get them from the hashmap and the json object them and display them.
        if (hashMap.get(String(day)) === undefined) {
            td.innerHTML = content;
        } else {
            for (let j = 0; j < hashMap.get(String(day)).length; j++) {
                content += '<button class="modal-open ' + jsonObj[hashMap.get(String(day))[j]]["color"] + 'Event" data-modal="modal' + jsonObj[hashMap.get(String(day))[j]]["id"] + '">' + jsonObj[hashMap.get(String(day))[j]]["title"] + '</button>';
            }
            td.innerHTML = content;
        }
    }
}

//Function that adjusts shows the events on the day calendar.
function adjustDay() {
    //We retrieve the events of this day for this user.
    fetch("/calendar/day?date=" + dateToJsonFormat(currentDate) + "&email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((json) => {
            //We get a json object containing the events of this day.
            let jsonObj = JSON.parse(json);

            //We retrieve the events of the day before, in case they extend on this day.
            let yesterday = new Date();
            yesterday.setDate(currentDate.getDate() - 1);
            fetch("/calendar/day?date=" + dateToJsonFormat(yesterday) + "&email=" + getLoggedInUser())
                .then((response2) => response2.text())
                .then((json2) => {
                    //We get a json object containing the events of the day before.
                    let jsonObj2 = JSON.parse(json2);

                    //We create a hashmap that contains the events in this way -> "hour" : "indexes of the events in the json object".
                    let hashMap = createHashMapDay(jsonObj, jsonObj2);

                    //We fill the calendar hour by hour
                    fillWithEventsDay(hashMap, jsonObj, jsonObj2);

                    createModalWindows(jsonObj);
                    createModalWindows(jsonObj2);
                    associateModalBtnsToWindows();
                })
        })
}

//Function that creates the hashMap needed for the day version of the calendar.
function createHashMapDay(jsonObj, jsonObj2) {
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
    return hashMap;
}

//Function that fills the day version of the calendar with events, hour by hour.
function fillWithEventsDay(hashMap, jsonObj, jsonObj2) {
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
                    location.assign("/500");
                }
            }
            td.innerHTML = events;
        } else {
            td.innerHTML = "";
        }
    }
}

//Function that adjusts shows the events on the week calendar.
function adjustWeek() {
    //We retrieve the events of this week for this user.
    fetch("/calendar/week?date=" + dateToJsonFormat(currentDate) + "&email=" + getLoggedInUser())
        .then((response) => response.text())
        .then((json) => {
            //We get a json object containing the events of this week.
            let jsonObj = JSON.parse(json);

            //We create a hashmap that contains the events in this way -> ("day of the week-hour") : "indexes of the events in the json object".
            let hashMap = createHashMapWeek(jsonObj);

            //We add a rectangle on today if today is shown on this week.
            addRectangleOnToday();

            //We fill the calendar day by day and hour by hour
            fillWithEventsWeek(hashMap, jsonObj);

            createModalWindows(jsonObj);
            associateModalBtnsToWindows();
        })
}

//Function that creates the hashMap needed for the week version of the calendar.
function createHashMapWeek(jsonObj) {
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
    return hashMap;
}

//Function that adds a class on today if it is displayed on this week, the class shows the user which day today is.
function addRectangleOnToday() {
    //We clean all the days of the rectangle class.
    for (let i = 0; i < 7; ++i) {
        const currentTh = document.querySelector("#Week" + getWeekId(i));
        currentTh.classList.remove("rectangle");
    }

    //We add a rectangle on the current day.
    let today = new Date();
    if (getWeekFromDate(today) === getWeekFromDate(currentDate) && currentDate.getFullYear() === today.getFullYear()) {
        const currentTh = document.querySelector("#Week" + getWeekId(today.getDay()));
        currentTh.classList.add("rectangle");
    }
}

function fillWithEventsWeek(hashMap, jsonObj) {
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
    associateOpenBtns();

    //We get the buttons closing the windows and associate them with their modal windows
    associateCloseBtns();

    //We make it so that a click outside the modal window closes it.
    associateOutsideClicks();

    //We get the buttons deleting the events and associate them with their modal windows
    associateDeleteBtns();
}

//Function that associates the opening buttons to their modal windows.
function associateOpenBtns() {
    let modalBtns = document.querySelectorAll(".modal-open");
    modalBtns.forEach(function (btn) {
        btn.onclick = function () {
            let modal = btn.getAttribute('data-modal');


            document.getElementById(modal).style.display = 'block';

            let scrollY;

            //We associate the forms in the modal windows made to edit events.
            if (modal.substring(0, 4) === "edit") {
                //We close the first modal so only the second modal remains open.
                btn.closest(".modal").style.display = "none";
                associateForm(modal);
                scrollY = sessionStorage.getItem('scrollBefore');
            } else {
                scrollY = sessionStorage.getItem('scrollY');
                sessionStorage.setItem('scrollBefore', scrollY);
            }
            //Disable the page's scrolling whilst the modal window is open.
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}`;
        }
    })
}

//Function that associates the closing buttons to their modal windows.
function associateCloseBtns() {
    let closeBtns = document.querySelectorAll('.modal-close');
    closeBtns.forEach(function (btn) {
        btn.onclick = function () {
            btn.closest(".modal").style.display = "none";

            //Enable the page's scrolling whilst the modal window is close.
            enableScroll();

            //Function that reset the fields of the forms, when the user leave the modal window.
            resetEditForms();
        }
    })
}

//Function that associates a click outside the modal window to the action of closing it.
function associateOutsideClicks() {
    window.onclick = function (e) {
        if (e.target.className === "modal") {
            e.target.style.display = "none";

            //Enable the page's scrolling whilst the modal window is close.
            enableScroll()

            //Function that reset the fields of the forms, when the user leaves the modal window.
            resetEditForms();
        }
    }
}

//Function that enables scroll again for the user and puts them back to their last position.
function enableScroll() {
    const scrollY = sessionStorage.getItem('scrollBefore');
    //If there is still a modal window open, we don't enable scrolling
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0'));
}

//Function that associate the delete buttons to their events.
function associateDeleteBtns() {
    let deleteBtns = document.querySelectorAll('.delete');
    deleteBtns.forEach(function (btn) {
        btn.onclick = function () {
            let idEvent = btn.getAttribute("id").substring(6);

            //We send the id to our API which will delete the event.
            let body = {
                id: idEvent
            }
            let params = {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            };
            fetch("/events/delete", params)
                .then((response) => response.text())
                .then((str) => {
                    if (str === "failure" || str === "error") {
                        alert("Une erreur est survenue lors de l'ajout d'un ??v??nement ! Veuillez recommencer")
                    } else {
                        //We notify the other users of the change
                        sendNotice();
                    }
                    location.reload();
                })
        }
    })
}


//Function that resets all the forms in the document (called when we close a modal window).
function resetEditForms() {
    let forms = document.querySelectorAll("form");

    forms.forEach(function (form) {
        form.reset();
    })
}

//Function that activates a form to edit an event.
function associateForm(id) {
    const formulaireEdit = document.querySelector("#" + id + "form");

    //When the form to edit an event is submitted.
    formulaireEdit.addEventListener("submit", function (event) {
        //Disable the form's sending.
        event.preventDefault();

        let title = document.querySelector('#title' + id);
        let description = document.querySelector('#description' + id);
        let date = document.querySelector('#start-date' + id);
        let start_time = document.querySelector('#start_time' + id);
        let duration = document.querySelector('#duration' + id);
        let color = document.querySelector('#color' + id);

        const user_email = getLoggedInUser();
        //We get the username of the logged-in user.
        fetch("/account/getUsername?email=" + user_email)
            .then((response) => response.text())
            .then((username) => {
                //We send the datas to our API
                let body = {
                    id: id.substring(4),
                    owner: username,
                    owner_email: user_email,
                    title: title.value,
                    description: description.value,
                    date: date.value,
                    start_time: start_time.value,
                    duration: duration.value,
                    color: color.value
                }
                let params = {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(body),
                };
                fetch("/events/edit", params)
                    .then((response) => response.text())
                    .then((str) => {
                        if (str === "failure" || str === "error") {
                            alert("Une erreur est survenue lors de l'ajout d'un ??v??nement ! Veuillez recommencer")
                        }
                        //We notify the other users of the change
                        sendNotice();
                        //We redirect the user to the index page.
                        location.reload();
                    });
            })
    });
}

//Function that creates the modal windows based on their event's information
function createModalWindows(jsonObj) {
    //Getting the div that will contain the modal windows
    const container = document.querySelector("#modal-windows");
    let modalWindows = "";

    //Creating the windows with the events' information inside them.
    for (let i = 0; i < jsonObj.length; i++) {
        //The modal window to show the event's information and allow the user to take actions on this event.
        modalWindows += createDisplayModalWindow(jsonObj, i);

        //The modal window to allow editing of the event's information.
        modalWindows += createEditModalWindow(jsonObj, i);
    }

    container.innerHTML += modalWindows;
}

//Function that creates the html code of the modal window to display an event.
function createDisplayModalWindow(jsonObj, i) {
    return '<div class="modal" id="modal' + jsonObj[i]["id"] + '">\n' +
        '    <div class="modal-content">\n' +
        '        <div class="modal-header ' + jsonObj[i]["color"] + 'Text">' + jsonObj[i]["title"] + '\n' +
        '            <button class="icon modal-close"><i class="material-icons">close</i></button>\n' +
        '        </div>\n' +
        '        <div class="modal-body center">\n' +
        '           ' + jsonObj[i]["description"] + '<br>' +
        '           Date : ' + dayDisplay(new Date(jsonObj[i]["date"])) + '<br>' +
        '           D??but : ' + jsonObj[i]["start_time"] + ' h' + '<br>' +
        '           Dur??e : ' + jsonObj[i]["duration"] + ' h' + '<br>' +
        '           Importance : ' + getImportance(jsonObj[i]["color"]) +
        '        </div>\n' +
        '        <div class="modal-footer center">\n' +
        '        <button class="delete smallButton" id="delete' + jsonObj[i]["id"] + '">Supprimer</button>' +
        '        <button class="edit smallButton modal-open" data-modal="edit' + jsonObj[i]["id"] + '">Modifier</button>' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
}

//Function that creates the html code of the modal window to edit an event.
function createEditModalWindow(jsonObj, i) {
    return '<div class="modal" id="edit' + jsonObj[i]["id"] + '">\n' +
        '    <div class="modal-content formModal">\n' +
        '        <div class="modal-header ' + jsonObj[i]["color"] + 'Text">' + jsonObj[i]["title"] + '\n' +
        '            <button class="icon modal-close"><i class="material-icons">close</i></button>\n' +
        '        </div>\n' +
        '        <div class="modal-body center">\n' +
        '        <form method="post" id="edit' + jsonObj[i]["id"] + 'form">\n' +
        '           <label for="title"></label>\n' +
        '           <input type="text" id="titleedit' + jsonObj[i]["id"] + '" value="' + jsonObj[i]["title"] + '" maxlength="10" required>\n' +
        '           <label for="description"></label>\n' +
        '                <textarea id="descriptionedit' + jsonObj[i]["id"] + '" name="description" rows="5" cols="33">' + jsonObj[i]["description"] + '</textarea>\n' +
        '           <label for="start-date"></label>\n' +
        '           <input class="hour" type="date" id="start-dateedit' + jsonObj[i]["id"] + '" name="start-date"\n' +
        '                  value="' + jsonObj[i]["date"] + '"\n' +
        '                  required style="margin-right:6px">' +
        '           <label for="start_time"></label>\n' +
        '           <input class="hour" type="number" id="start_timeedit' + jsonObj[i]["id"] + '" value="' + jsonObj[i]["start_time"] + '" min="0" max="23" required style="margin-right:6px">\n' +
        '           <label for="duration"></label>\n' +
        '           <input class="hour" type="number" id="durationedit' + jsonObj[i]["id"] + '" value="' + jsonObj[i]["duration"] + '" min="1" max="24" required>\n' +

        createSelectImportanceToEdit(jsonObj, i) +

        '        </form>' +
        '        </div>\n' +
        '        <div class="modal-footer center">\n' +
        '        <button class="modal-close">Annuler</button>\n' +
        '        <button class="smallButton" form="edit' + jsonObj[i]["id"] + 'form">Sauvegarder</button>' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>';
}

//Function that creates the select element's html code based on the current event's importance.
function createSelectImportanceToEdit(jsonObj, i) {
    let colorEvent = jsonObj[i]["color"];

    let res = '<label for="color"></label>\n' +
        '<select name="color" id="coloredit' + jsonObj[i]["id"] + '">\n';

    //The first option should be the priority that the event has right now.
    res += '<option value="' + colorEvent + '">' + getImportance(colorEvent) + '</option>\n';

    let tabColor = ["red", "orange", "yellow", "green"];
    for (let i = 0; i < 4; i++) {
        if (tabColor[i] !== colorEvent) {
            res += '<option value="' + tabColor[i] + '">' + getImportance(tabColor[i]) + '</option>\n';
        }
    }

    res += '</select>\n';
    return res;
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
            res = "Tr??s important !";
            break;
        case "orange":
            res = "Important";
            break;
        case "yellow":
            res = "Assez important";
            break;
        case "green":
            res = "Peu important...mais n??cessaire !";
            break;
    }
    return res;
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

//Function that return the week number from the date given. If week number = 2, it corresponds to the second week of the year.
function getWeekFromDate(date) {
    // Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to the nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to the nearest Thursday
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}
