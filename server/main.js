const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT = 3000;

// Logger for now
app.use("/", (req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
})

// Middleware stuff
app.use(express.json());
app.use(cors({
    origin: [`http://localhost:5500`, `http://127.0.0.1:5500`]
}))

// Static files
app.use("/", express.static(path.join(__dirname, "..", "public")))
app.use("/data", express.static(path.join(__dirname, "..", "data")))

// Routers
app.use("/", require("./../routes/root"))
app.use("/data", require("./../routes/data"))

// 404
app.get("/*e", (req, res, next) => {
    const filePath = req.path;
    const extension = filePath.includes(".") ? filePath.slice(filePath.lastIndexOf(".")) : ".";

    res.status(404);
    switch (extension){
        case ".json":
            res.send(404);
            break;
        case ".css":
            res.send(null);
            break;
        case ".html":
            res.sendFile(path.join(__dirname, "..", "views", "404.html"));
            break;
        case ".":
            res.sendFile(path.join(__dirname, "..", "views", "404.html"));
            break;
        default:
            res.send("Resource not found");
            break;
    }
})



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
})