const controller = require('../models/event.js')
const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require("body-parser")
const urlEncodedParser = bodyParser.urlencoded({extended: false});

app.use(express.static(__dirname + '/../../public'));

app.listen(3030, () => {
    console.log("Server is starting !")
})

app.get('/', (req, res) => {

})

app.get('/login', (req, res) => {
    res.send("Login")
})

app.get('/register', (req, res) => {
    res.send("Register")
})

app.get('/calendar/month', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.send(controller.getEventsByMonth(date, user));
})

app.get('/calendar/week', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.send(controller.getEventsByWeek(date, user));
})

app.get('/calendar/day', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.send(controller.getEventsByDay(date, user));
})

app.get('/events', (req, res) => {
    res.send(controller.getAllEvents());
})

app.get('/events/get', (req, res) => {
    let id = req.query.id;
    res.send(controller.getEventById(id));
})

app.get('/events/edit', (req, res) => {
    res.send("Events")
})

app.post('/events/add', urlEncodedParser, (req, res) => {
    let id = req.body.id;
    let owner = req.body.owner;
    let title = req.body.title;
    let date = req.body.date;
    let duration = req.body.duration;
    let start_time = req.body.start_time;

    controller.addEvent(id,owner,title,date,duration,start_time);

    res.send("Event added successfully")
})

app.get('/events/delete', (req, res) => {
    //TODO Passer en delete/post une fois bouton de delete d'event fait. (permet d'éviter de passer des infos dans l'url; et donc d'éviter de les rendres visibles)
    let id = req.query.id;
    controller.deleteEvent(id);
    res.send("Event deleted successfully");
})