///////////////////////////////////////////////////////////
///////////Path api/getfeed//////////////////////////////////
//This routes is uses for extract the feed data/////////////
//This accept url parameter in the fallowing format/////////////
//...api/getfeed?url=myurl.com - without the http://///////////
//and img parameter with true or false value//////////
//this define if the api load image of articles///////////
//the complete format is the fallowing///////////////
//..api/getfeed?url=myurl.com&img=true////////////////
///////////////////////////////////////////////////////////////////

const {Router} = require("express");
const GetData = require("../services/feedmaster");
const url = require("url");
const router = Router();

router.get("/api/getfeed",async (req, res) => {

    //Get url parameter
    const urls = url.parse(req.url,true).query["url"]
    const img = url.parse(req.url,true).query["img"]

    if(urls && img){
        try {
            //Get and send the feed data
            GetData("http://" + urls,img,res);
        }catch (error){
            //Catch any error and report it
            res.status(400).json(
                {
                    "ok":"false",
                    "msg":error
                })
        }
    }else {
        res.status(400).json({
            "ok":false,
            "msg":"Incorrect request format"
        })
    }



})

module.exports = router;
