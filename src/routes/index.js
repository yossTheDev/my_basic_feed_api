const {Router} = require("express");
const router = Router();
const GetData = require("../../services/feedmaster");

//Get the data of the RSS sources
router.get("/",async (req, res) => {
    res.json({"ok":true})
})

module.exports = router;