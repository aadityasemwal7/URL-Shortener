const express = require("express")
const router = express.Router();

const {createShortUrl, redirectToOriginalUrl, getUrlStats} = require("../controllers/shortController")

router.post("/shorten", createShortUrl)
router.get("/stats/:shortCode", getUrlStats)



module.exports = router;