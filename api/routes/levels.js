const router = require('express').Router();
const mongoose = require('mongoose');
const User = require("../models/User");

router.get("/get-level-details/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const userLevelDetails = await User.findById(userId);
        if (!userLevelDetails) {
            return res.status(404).send("This user does not exist");
        }

        const flags = userLevelDetails.flags;
        const levelFinished = userLevelDetails.levelFinished;
        const levels = userLevelDetails.levels;

        let atLevel = -1;
        for (let i = 0; i < levelFinished.length; i++) {
            if (!levelFinished[i]) {
                atLevel = i;
                break;
            }
        }
        return res.status(200).send({ levelNo: atLevel, level: levels[atLevel], flag: flags[atLevel] });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.post("/update-level/", async (req, res) => {
    try {
        const userId = req.body.userId;
        const levelIndex = req.body.level;

        // Update the boolean array and set the current time in finishTimes
        await User.updateOne(
            { _id: userId },
            { 
                $set: { 
                    [`levelFinished.${levelIndex}`]: true,
                    [`finishTimes.${levelIndex}`]: new Date()  // Set current time
                }
            }
        );

        return res.status(200).send("You have passed this level!");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().select('username levelFinished finishTimes'); 
        if (users.length === 0) {
            return res.status(200).json([]); 
        }

        const leaderboard = users.map(user => {
            const levelsFinishedArray = user.levelFinished || [];
            const finishTimesArray = user.finishTimes || [];

            // count of finished levels
            const levelsFinishedCount = levelsFinishedArray.filter(Boolean).length; 

            // get the latest finish time for the last finished level
            const latestTime = levelsFinishedCount > 0 ? finishTimesArray[levelsFinishedCount - 1] : null;

            return {
                username: user.username,
                levelsFinished: levelsFinishedCount, 
                latestTime: latestTime
            };
        }).sort((a, b) => {
            // sort by levels finished, then by latest time
            if (b.levelsFinished !== a.levelsFinished) {
                return b.levelsFinished - a.levelsFinished;
            }
            return (a.latestTime || 0) - (b.latestTime || 0);
        });

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).send('Internal Server Error');
    }
});




module.exports = router;
