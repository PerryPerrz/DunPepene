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
    res.send(controller.getEventsByMonth(date));
})

app.get('/calendar/week', (req, res) => {
    let date = req.query.date;
    res.send(controller.getEventsByWeek(date));
})

app.get('/calendar/day', (req, res) => {
    let date = req.query.date;
    res.send(controller.getEventsByDay(date));
})

app.get('/events', (req, res) => {
    res.send("Events")
})

app.get('/events/get', (req, res) => {
    res.send("Events")
})

app.get('/events/edit', (req, res) => {
    res.send("Events")
})

app.get('/events/delete', (req, res) => {
    res.send("Events")
})