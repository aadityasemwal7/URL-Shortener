require("dotenv").config();
const app = require('./app');

const connectDb = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
    console.log("Database connected successfully!");
}).catch(err => console.log("error -> ", err))


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})