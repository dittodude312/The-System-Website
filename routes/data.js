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

module.exports = router;