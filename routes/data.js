const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const router = express.Router();


router.put("/grades/:name", (req, res) => {
    const name = req.params.name;
    const data = JSON.stringify(req.body);

    fs.writeFile(path.join(__dirname, "..", "data", "grades", name + ".json"), data);
    res.send("done");
})

router.post("/supplies/requests.csv", (req, res) => {
    const body = req.body;
    const line = `\n${body.username},${body.supply},${body.quantity}`;
    fs.appendFile(path.join(__dirname, "..", "data", "supplies", "requests.csv"), line);
    res.send("Request was recieved.");
})

module.exports = router;