const express = require('express');
const cors = require("cors")
const shortRoutes = require("./routes/shortRoutes");
const { redirectToOriginalUrl } = require('./controllers/shortController');

const app = express();

app.use(cors())
app.use(express.json())

app.get('/ping', (req, res) => {
    res.json({message : "backend is working!"})
})

app.use("/api", shortRoutes);

app.get("/:shortCode", redirectToOriginalUrl)
module.exports = app;