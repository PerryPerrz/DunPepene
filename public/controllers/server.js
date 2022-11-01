require('dotenv').config()

const controller = require('../models/event.js')
const controllerAccount = require('../models/account.js')
const express = require('express')
const path = require('path')
const app = express()

const jwt = require('jsonwebtoken')
const bodyParser = require("body-parser")
const urlEncodedParser = bodyParser.urlencoded({extended: false});

const account = require('../models/account.json')

app.use(express.json())
app.use(express.static(__dirname + '/../../public'));

app.listen(3030, () => {
    console.log("Server is starting !")
})

app.get('/posts', authenticateToken, (req, res) => {
    res.json(account.filter(post => post.email === req.user.email));
})

app.get('/', (req, res) => {

})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname + "/../views/loginView.html"));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + "/../views/registerView.html"));
})

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname + "/../index.html"));
})

app.post('/signin', urlEncodedParser, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let reponse = controllerAccount.signIn(email, password);

    //TODO : préciser les erreurs et les codes et en rajouter si nécessaire.
    if (reponse === "failure") {
        res.status(400);
        res.send("failure")
    } else if (reponse === "success") {
        res.status(200);

        //Authenticate User
        const user = {email: email}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})

        res.json({accessToken: accessToken})
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

        //We authenticate the user when he registers.
        const user = {email: email}
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})

        res.json({accessToken: accessToken})
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

app.get('/calendar/show/month', (req, res) => {
    res.sendFile(path.join(__dirname + "/../views/calendarMonthView.html"));
})

app.get('/calendar/show/week', (req, res) => {
    res.sendFile(path.join(__dirname + "/../views/calendarWeekView.html"));
})

app.get('/calendar/show/day', (req, res) => {
    res.sendFile(path.join(__dirname + "/../views/calendarDayView.html"));
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
    let description = req.body.description;
    let date = req.body.date;
    let duration = req.body.duration;
    let start_time = req.body.start_time;
    let color = req.body.color;

    let reponse = controller.addEvent(id, owner, title, description, date, duration, start_time, color);

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

app.delete('/events/delete', (req, res) => {
    let id = req.body.id;
    console.log(id)
    let response = controller.deleteEvent(id);

    //TODO : préciser les erreurs et les codes et en rajouter si nécessaire.
    if (response === "failure") {
        res.status(400);
        res.send(response);
    } else if (response === "success") {
        res.status(200);
        res.send(response);
    } else {
        res.status(400);
        res.send("error");
    }
})

app.get('/account/getUsername', (req, res) => {
    let email = req.query.email;
    let reponse = controllerAccount.getUsernameWithEmail(email);

    if (reponse === null) {
        res.status(204);
        res.send("no content");
    } else if (reponse === "failure") {
        res.status(400);
        res.send("failure");
    } else {
        res.status(200);
        res.send(reponse);
    }
})


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]; //If authHeader exist, split it otherwise return undefine.
    if (token == null) {
        return res.sendStatus(401);
    }

    //Verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    })
}