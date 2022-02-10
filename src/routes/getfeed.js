//////////////////////////////////////////////////
///////////Path api/getfeed////////////////////////
//This routes is uses for extract the feed data/////
//This accept url parameter in the fallowing format///
//...api/getfeed?url=myurl.com - without the http://
///////////////////////////////////////////////////

const {Router} = require("express");
const GetData = require("../../services/feedmaster");
const url = require("url");
const router = Router();

router.get("/api/getfeed",async (req, res) => {
    try {
        //Get url parameter
        const urls = url.parse(req.url,true).query["url"]

        //Get and send the feed data
        GetData("http://" + urls,res);
    }catch (error){
        //Catch any error and report it
        res.status(400).json(
            {
                "ok":"false",
                "msg":error
            })
    }
})

module.exports = router;
