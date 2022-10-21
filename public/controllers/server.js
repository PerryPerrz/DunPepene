const express = require('express')
const app = express()

app.listen(3030, () => {
    console.log("Serveur lancé !")
})

app.get('/test', (req, res) => {
    res.send("test")
})
