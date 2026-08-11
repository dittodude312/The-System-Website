const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

app.use("/", (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
})

app.use(express.json());

app.use(cors({
    origin: [`http://localhost:5500`, `http://127.0.0.1:5500`]
}))

app.use("/", express.static(path.join(__dirname, "..", "public")))
app.use("/data", express.static(path.join(__dirname, "..", "data")))

app.use("/", require("./../routes/root"))
app.use("/data", require("./../routes/data"))


app.listen(3000, () => {
    console.log(`Server is running.`);
})