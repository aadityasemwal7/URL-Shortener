const Url = require("../models/Url");
const validator = require("validator");

const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl || originalUrl.trim() === "") {
      return res.status(400).json({ message: "Original URL is required" });
    }

    const trimmedUrl = originalUrl.trim();

    // STRICT VALIDATION
    const isValid =
      validator.isURL(trimmedUrl, {
        protocols: ["http", "https"],
        require_protocol: true,
        require_valid_protocol: true,
        require_host: true,
        require_tld: true,
      });

    if (!isValid) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const existing = await Url.findOne({ originalUrl: trimmedUrl });

    if (existing) {
      return res.status(200).json({
        shortUrl: `http://localhost:5000/${existing.shortCode}`,
        message: "URL already shortened",
      });
    }

    let shortCode;
    let exists = true;

    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortCode });
    }

    const newUrl = await Url.create({
      originalUrl: trimmedUrl,
      shortCode,
    });

    return res.status(201).json({
      shortUrl: `http://localhost:5000/${newUrl.shortCode}`,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    url.clicks += 1;
    await url.save();

    return res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    res.status(200).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlStats,
};