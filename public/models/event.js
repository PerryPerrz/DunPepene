const json = require("./event.json");

module.exports = {
    getEventsByMonth: function (date) {
        let events = [];
        let parsedDate = parse(date, "-");

        //We search in the JSON file for all the events that have the same month and year as the month we want to display.
        json.forEach(function (event) {
            if (parse(event.date, "-").year === parsedDate.year && parse(event.date, "-").month === parsedDate.month) {
                events.push(event);
            }
            console.log(event.date);
        })
        return events;
    },
    getEventsByWeek: function (date) {
        let events = [];
        let parsedDate = parse(date, "-");
        let weekNo = getWeekFromDate(new Date(date));

        //We search in the JSON file for all the events that have the same week number and year as the week we want to display.
        json.forEach(function (event) {
            let yearTemp = parse(event.date, "-").year;

            if (getWeekFromDate(new Date(event.date)) === weekNo && yearTemp === parsedDate.year) {
                events.push(event);
            }
            console.log(event.date);
        })
        return events;
    },
    getEventsByDay: function (date) {
        let events = [];
        let parsedDate = parse(date, "-");

        //We search in the JSON file for all the events that have the same  day,month and year as the day we want to display.
        json.forEach(function (event) {
            if (parse(event.date, "-").year === parsedDate.year && parse(event.date, "-").month === parsedDate.month && parse(event.date, "-").day === parsedDate.day) {
                events.push(event);
            }
            console.log(event.date);
        })
        return events;
    }
}

//Function that parses a string with the separator given and that returns an object who has 3 fields : year/month/day.
function parse(string, separator) {
    let date = string.split(separator);
    return {"year": date[0], "month": date[1], "day": date[2]};
}

//Function that return the week number from the date given. If week number = 2, it corresponds to the second week of the year.
function getWeekFromDate(date) {
    // Copy date so don't modify original
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to the nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to the nearest Thursday
    var weekNo = Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
    return weekNo;
}