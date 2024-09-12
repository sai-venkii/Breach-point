const express = require("express");
const router = express.Router();
const Teams = require('../Models/Teams');
const bcrypt = require('bcrypt');
router.use(express.json());

router.post("/register", async (req, res) => {
    const { teamName, password, email } = req.body;

    try {
        const user = await Teams.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "Email Already Exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeam = new Teams({
            name: teamName,
            email: email,
            password: hashedPassword
        });

        await newTeam.save();
        res.status(201).json({ message: "Team created successfully" });

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

router.post("/login", async (req, res) => {
    const { teamName, password } = req.body;

    try {
        const team = await Teams.findOne({ name: teamName });
        if (!team) {
            return res.status(404).json({ message: "Team not found" });
        }
        const match = await bcrypt.compare(password, team.password);
        if (match) {
            res.redirect('/');
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

module.exports = router;
