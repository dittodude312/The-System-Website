const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const router = express.Router();

async function loginData(){
    data = await fs.readFile(path.join(__dirname, "..", "data", "users.json"), "utf-8");
    return JSON.parse(data);
}

router.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "login.html"));
})

router.post("/login.html", async (req, res) => {
    const data = await loginData();
    const body = req.body;

    if(data[body.username] != body.password){
        res.send({status: "wrong"})
    }
    else{
        res.send({status: "right"})
    }
})


router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
})
router.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
})

router.get("/grades.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "grades.html"));
})

router.get("/testscores.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "testscores.html"));
})

router.get("/supplies.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "supplies.html"));
})

router.get("/xmans.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "xmans.html"));
})



router.get("/doodpool.html", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "views", "doodpool.html"));
})


module.exports = router;