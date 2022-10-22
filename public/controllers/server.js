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

app.get('/events/delete', (req, res) => {
    let id = req.query.id;
    controller.deleteEvent(id);
    res.send("Event deleted successfully");
})