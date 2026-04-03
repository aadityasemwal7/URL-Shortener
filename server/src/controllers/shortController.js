const Url = require("../models/url")

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const createShortUrl = async(req, res) => {
    try {
        const { originalUrl } = req.body;

        if(!originalUrl){
            return res.status(400).json({message : "Original url is required!"})
        }

        const shortCode = generateShortCode();

        const newUrl = await Url.create({
            originalUrl,
            shortCode,
        })

        res.status(201).json({
            shortUrl: `http://localhost:5000/${newUrl.shortCode}`,
            data: newUrl,
        })
    }catch(err){
        res.status(500).json({ message : "server error -> ", err : err.message })
    }
}

const redirectToOriginalUrl = async(req, res) => {
    try {
        const { shortCode } = req.params;
        const url = await Url.findOne({ shortCode })

        if(!url){res.status(400).json({message : "short url not found!"})}

        url.clicks += 1;
        await url.save();

        return res.redirect(url.originalUrl)
    }
    catch(error){
        res.status(500).json({message: "server error", error: error.message})
    }
}


module.exports = {createShortUrl, redirectToOriginalUrl};