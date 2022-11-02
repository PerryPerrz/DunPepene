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
    res.status(200);
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
    let response = controllerAccount.signIn(email, password);

    if (response === "failure") {
        res.status(400);
        res.send("failure")
    } else if (response === "success") {
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

    let response = controllerAccount.signUp(username, email, password);

    if (response === "failure") {
        res.status(400);
        res.send(response);
    } else if (response === "success") {
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
    res.status(200);
    res.send(controller.getEventsByMonth(date, user));
})

app.get('/calendar/week', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.status(200);
    res.send(controller.getEventsByWeek(date, user));
})

app.get('/calendar/day', (req, res) => {
    let date = req.query.date;
    let user = req.query.user;
    res.status(200);
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
    let response = controller.getAllEvents();

    if (response.length === 0) {
        res.status(204);
        res.send();
    } else {
        res.status(200);
        res.send(response);
    }
})

app.get('/events/get', (req, res) => {
    let id = req.query.id;
    let response = controller.getEventById(id)

    if (response === "failure") {
        res.status(204);
        res.send();
    } else {
        res.status(200);
        res.send(response);
    }
})

app.post('/events/edit', urlEncodedParser, (req, res) => {
    let id = req.body.id;
    let owner = req.body.owner;
    let title = req.body.title;
    let description = req.body.description;
    let date = req.body.date;
    let duration = req.body.duration;
    let start_time = req.body.start_time;
    let color = req.body.color;

    let response = controller.editEvent(id, owner, title, description, date, duration, start_time, color);

    if (response === "failure") {
        res.status(400);
        res.send(response);
    } else if (response === "success") {
        res.status(201);
        res.send(response);
    } else {
        res.status(400);
        res.send("error");
    }
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

    let response = controller.addEvent(id, owner, title, description, date, duration, start_time, color);

    if (response === "failure") {
        res.status(400);
        res.send(response);
    } else if (response === "success") {
        res.status(201);
        res.send(response);
    } else {
        res.status(400);
        res.send("error");
    }
})

app.delete('/events/delete', urlEncodedParser, (req, res) => {
    let id = req.body.id;
    let response = controller.deleteEvent(id);

    if (response === "failure") {
        res.status(400);
        res.send(response);
    } else if (response === "success") {
        res.status(204);
        res.send();
    } else {
        res.status(400);
        res.send("error");
    }
})

app.get('/account/getUsername', (req, res) => {
    let email = req.query.email;
    let response = controllerAccount.getUsernameWithEmail(email);


    if (response === "failure") {
        res.status(400);
        res.send(response);
    } else {
        res.status(200);
        res.send(response);
    }
})

app.get('/teapot', (req, res) => {
    res.status(418);
    res.sendFile(path.join(__dirname + "/../views/teapotView.html"));
})

app.get('/401', (req, res) => {
    res.status(401);
    res.sendFile(path.join(__dirname + "/../views/error401View.html"));
})

app.get('/500', (req, res) => {
    res.status(500);
    res.sendFile(path.join(__dirname + "/../views/error500View.html"));
})


app.get('*', (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname + "/../views/error404View.html"));
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