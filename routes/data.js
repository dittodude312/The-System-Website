const express = require("express");
const path = require("path");
const fs = require("fs/promises");
const router = express.Router();


router.put("/grades/:name",  async (req, res) => {
    const name = req.params.name;
    const data = JSON.stringify(req.body);
    const classes = Object.keys(req.body);
    const grades = Object.values(req.body);
    const savedData = {};

    try{
        const tmp = JSON.parse(await fs.readFile(path.join(__dirname, "..", "data", "grades", name + ".json"), "utf-8"));
        Object.assign(savedData, tmp);
    }
    catch{
        res.send("bad");
        return null;
    }

    if(classes.length != 6){
        res.send("bad");
        return null;
    }
    for(let i = 0; i < 6; i++){
        if(classes[i] != Object.keys(savedData)[i]){
            res.send("bad");
            return null;
        }
    }
    for(let grade of grades){
        if(!["A", "B", "C", "D", "E", "F"].includes(grade)){
            res.send("bad");
            return null;
        }
    }

    fs.writeFile(path.join(__dirname, "..", "data", "grades", name + ".json"), data);
    res.send("good");
})

router.post("/supplies/requests.csv", async (req, res) => {
    const body = req.body;
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    const usernames = Object.keys(JSON.parse(await fs.readFile(path.join(__dirname, "..", "data", "users.json"), "utf-8")))

    if(!usernames.includes(values[0])){
        res.send("Invalid supply request.");
        return null;
    }
    if(typeof values[2] != "number"){
        res.send("Invalid supply request.");
        return null;
    }
    
    const line = `\n${body.username},${body.supply},${body.quantity}`;
    fs.appendFile(path.join(__dirname, "..", "data", "supplies", "requests.csv"), line);
    res.send("Request was recieved.");
})

module.exports = router;