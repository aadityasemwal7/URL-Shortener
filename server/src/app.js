const express = require("express");
const cors = require("cors");
const shortRoutes = require("./routes/shortRoutes");
const { redirectToOriginalUrl } = require("./controllers/shortController");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://url-shortener-frontend-1ei3ni4ip-aadityas-projects-205f54df.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

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