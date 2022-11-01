const fs = require('fs');
const fileName = './public/models/event.json';
const json = require('./event.json'); //json is an object that's contains the whole file content "event.json"

module.exports = {
    getEventsByMonth: function (date, user) {
        let events = [];
        let parsedDate = parse(date, "-");

        //We search in the JSON file for all the events that have the same month and year as the month we want to display.
        json.forEach(function (event) {

            let parsedEventDate = parse(event.date, "-");
            if (parsedEventDate.year === parsedDate.year && parsedEventDate.month === parsedDate.month && event.owner === user) {
                events.push(event);
            }
        })
        return events;
    },
    getEventsByWeek: function (date, user) {
        let events = [];
        let parsedDate = parse(date, "-");
        let weekNo = getWeekFromDate(new Date(date));

        //We search in the JSON file for all the events that have the same week number and year as the week we want to display.
        json.forEach(function (event) {
            let parsedEventDate = parse(event.date, "-");
            let eventWeekNo = getWeekFromDate(new Date(event.date));

            if (eventWeekNo === weekNo && parsedEventDate.year === parsedDate.year && event.owner === user) {
                events.push(event);
            }
        })
        return events;
    },
    getEventsByDay: function (date, user) {
        let events = [];
        let parsedDate = parse(date, "-");

        //We search in the JSON file for all the events that have the same  day,month and year as the day we want to display.
        json.forEach(function (event) {
            let parsedEventDate = parse(event.date, "-");
            if (parsedEventDate.year === parsedDate.year && parsedEventDate.month === parsedDate.month && parsedEventDate.day === parsedDate.day && event.owner === user) {
                events.push(event);
            }
        })
        return events;
    },
    getAllEvents: function () {
        let events = [];

        //We search in the JSON file for all the events.
        json.forEach(function (event) {
            events.push(event);
        })
        return events;
    },
    getEventById: function (id) {
        let res = findEventById(id);
        if (res[0] === null)
            return "failure"
        return res[1];
    },
    addEvent: function (id, owner, title, description, date, duration, start_time, color) {
        if (findEventById(id)[0] !== null)
            return "failure";

        //Here, the event doesn't exist yet.
        //We add the event in the Json object.
        json.push({
            "id": id,
            "owner": owner,
            "title": title,
            "description": description,
            "date": date,
            "duration": duration,
            "start_time": start_time,
            "color": color
        });
        //We rewrite the Json file with the Json object's content.
        saveInJsonFile();

        return "success";
    },
    deleteEvent: function (id) {
        let event = findEventById(id)[0];
        if (event === null)
            return "failure"

        json.splice(event, 1);
        saveInJsonFile();
        return "success";
    },
    editEvent: function (id, owner, title, description, date, duration, start_time, color) {
        let event = findEventById(id);
        console.log(id)
        if (event[0] === null)
            return "failure"

        //We make sure that the owner and id stays the same.
        if (event[1].id !== id && event[1].owner !== owner)
            return "failure";

        //We delete the event.
        json.splice(event[0], 1);
        saveInJsonFile();

        //We add the event in the Json object with its new values.
        json.push({
            "id": id,
            "owner": owner,
            "title": title,
            "description": description,
            "date": date,
            "duration": duration,
            "start_time": start_time,
            "color": color
        });

        //We rewrite the Json file with the Json object's content.
        saveInJsonFile();

        return "success";
    }
}

//Function that parses a string with the separator given and that returns an object who has 3 fields : year/month/day.
function parse(string, separator) {
    let date = string.split(separator);
    return {"year": date[0], "month": date[1], "day": date[2]};
}

//Function that return the week number from the date given. If week number = 2, it corresponds to the second week of the year.
function getWeekFromDate(date) {
    // Set to the nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    let yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to the nearest Thursday
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

//Function that rewrites the content of the .json file with the new content of the json object.
function saveInJsonFile() {
    fs.writeFile(fileName, JSON.stringify(json, null, 2), function writeJSON(err) {
        if (err) return console.log(err);
        /*console.log(JSON.stringify(json,null, 2));
        console.log('writing to ' + fileName);*/
    });
}

//Function that finds an event by a given id, it returns an array that contains the index and the content of the event.
function findEventById(id) {
    let res = null;
    let res2 = null;
    let i = 0;
    //We search in the JSON file for the event that has the id (an id is unique) we are searching for.
    json.forEach(function (event) {
        if (event.id === id) {
            res = i;
            res2 = event;
        }
        i++;
    })
    return [res, res2];
}