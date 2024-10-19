const router = require('express').Router();
const mongoose = require('mongoose');
const Level = require("../models/LevelStructure")
const User = require("../models/User")

router.post("/create-level", async(req, res) => {
    try {
        const object = req.body.object;
        const levelNo = req.body.level;

        const newLevelObj = new Level({
            level: levelNo,
            directory: object
        });

        await newLevelObj.save();
        return res.status(200).send("New level created.");
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
});

router.get("/get-level-details/:userId", async(req, res) => {
    try {
        const userId = req.params.userId;
        const userLevelDetails = await User.findById(userId);
        if (!userLevelDetails) {
            return res.status(404).send("This user does not exist");
        }

        const flags = userLevelDetails.flags;
        const levels = userLevelDetails.levelFinished;

        let atLevel;
        for (let i = 0; i < levels.length; i++) {
            if (!levels[i]) {
                atLevel = i + 1;
                break;
            }
        }

        const levelExists = await Level.findOne({
            level: atLevel
        })

        if (!levelExists) {
            return res.status(404).send("This level does not exist");
        }

        return res.status(200).send({levelNo: atLevel});
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.get("/get-level/:levelNo", async(req, res) => {
    try {
        const levelNo = req.params.levelNo;
        const levelExists = await Level.findOne({
            level: levelNo
        })

        if (!levelExists) {
            return res.status(404).send("This level does not exist");
        }

        return res.status(200).send(levelExists.directory);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
})

module.exports = router;