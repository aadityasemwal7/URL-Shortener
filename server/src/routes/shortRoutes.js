const express = require("express")
const router = express.Router();

const {createShortUrl, redirectToOriginalUrl} = require("../controllers/shortController")

router.post("/shorten", createShortUrl)
router.get("/:shortCode", redirectToOriginalUrl)



module.exports = router;