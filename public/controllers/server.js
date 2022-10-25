const controller = require('../models/event.js')
const controllerAccount = require('../models/account.js')
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

app.post('/signin', urlEncodedParser, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    let reponse = controllerAccount.signIn(email, password);

    //TODO : préciser les erreurs et les codes et en rajouter si nécessaire.
    if (reponse === "failure") {
        res.status(400);
        res.send(reponse);
    } else if (reponse === "success") {
        res.status(200);
        res.send(reponse);
    } else {
        res.status(400);
        res.send("error");
    }
})

app.post('/signup', urlEncodedParser, (req, res) => {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let reponse = controllerAccount.signUp(username, email, password);

    //TODO : préciser les erreurs et les codes et en rajouter si nécessaire.
    if (reponse === "failure") {
        res.status(400);
        res.send(reponse);
    } else if (reponse === "success") {
        res.status(201);
        res.send(reponse);
    } else {
        res.status(400);
        res.send("error");
    }
})

app.get('/calendar/month', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.status(200); // TODO : gérer les erreurs possibles une fois que l'on à le calendrier.
    res.send(controller.getEventsByMonth(date, user));
})

app.get('/calendar/week', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.status(200); // TODO : gérer les erreurs possibles une fois que l'on à le calendrier.
    res.send(controller.getEventsByWeek(date, user));
})

app.get('/calendar/day', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.status(200); // TODO : gérer les erreurs possibles une fois que l'on à le calendrier.
    res.send(controller.getEventsByDay(date, user));
})

app.get('/events', (req, res) => {
    let reponse = controller.getAllEvents();

    if (reponse === null) {
        res.status(204);
        res.send("no content");
    } else {
        res.status(200);
        res.send(reponse);
    }
})

app.get('/events/get', (req, res) => {
    let id = req.query.id;
    let reponse = controller.getEventById(id)

    if (reponse === "failure") {
        res.status(204);
        res.send("no content");
    } else {
        res.status(200);
        res.send(reponse);
    }
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

    let reponse = controller.addEvent(id, owner, title, date, duration, start_time);

    //TODO : préciser les erreurs et les codes et en rajouter si nécessaire.
    if (reponse === "failure") {
        res.status(400);
        res.send(reponse);
    } else if (reponse === "success") {
        res.status(201);
        res.send(reponse);
    } else {
        res.status(400);
        res.send("error");
    }
})

app.get('/events/delete', (req, res) => {
    //TODO Passer en delete/post une fois bouton de delete d'event fait. (permet d'éviter de passer des infos dans l'url; et donc d'éviter de les rendres visibles)
    let id = req.query.id;
    let reponse = controller.deleteEvent(id);

    //TODO : préciser les erreurs et les codes et en rajouter si nécessaire.
    if (reponse === "failure") {
        res.status(400);
        res.send(reponse);
    } else if (reponse === "success") {
        res.status(200);
        res.send(reponse);
    } else {
        res.status(400);
        res.send("error");
    }
})