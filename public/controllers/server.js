const controller = require('../models/event.js')
const express = require('express')
const path = require('path')
const app = express()

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

app.get('/events/add', (req, res) => {
    //TODO Passer en post une fois formulaire d'ajout d'event fait.
    let id = req.query.id;
    let owner = req.query.owner;
    let title = req.query.title;
    let date = req.query.date;
    let duration = req.query.duration;
    let start_time = req.query.start_time;

    controller.addEvent(id,owner,title,date,duration,start_time);

    res.send("Event added successfully")
})

app.get('/events/delete', (req, res) => {
    //TODO Passer en delete/post une fois bouton de delete d'event fait. (permet d'éviter de passer des infos dans l'url; et donc d'éviter de les rendres visibles)
    let id = req.query.id;
    controller.deleteEvent(id);
    res.send("Event deleted successfully");
})