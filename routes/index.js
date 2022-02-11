const {Router} = require("express");
const router = Router();
require("../services/feedmaster");


router.get("/",async (req, res) => {
    res.json({"ok":true})
})

module.exports = router;