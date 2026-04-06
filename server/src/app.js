const express = require("express");
const cors = require("cors");
const shortRoutes = require("./routes/shortRoutes");
const { redirectToOriginalUrl } = require("./controllers/shortController");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://url-shortener-frontend-phi-murex.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman / direct browser requests

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/ping", (req, res) => {
  res.json({ message: "Backend is working 🚀" });
});

app.use("/api", shortRoutes);
app.get("/:shortCode", redirectToOriginalUrl);

module.exports = app;