const {Router} = require("express");
const router = Router();
const cheerio = require('cheerio');
const axios = require('axios');
const { read } = require('feed-reader/dist/cjs/feed-reader.js')

//Feed Data object with the data of the feed url
function FeedData(title,link,description,Entries){
    this.title = title;
    this.link = link;
    this.description = description;
    this.Entries = Entries;
}
//Entry object with the basic information of an article
function Entry(title,imageUrls,link,description,published) {
    this.title = title;
    this.imageUrls = imageUrls;
    this.link = link;
    this.description = description;
    this.published = published;
}

//Get all image urls from article link
async function GetImageUrlsFromLink(url){

    //Array with all image urls
    let imageUrls = [];

    //Get all image urls for meta tags
    try {
        //Initializing Axio and load the url
        const response = await axios.get(url); //Get response from the url
        const $ = cheerio.load(response.data); //Load data of the html page

        //Get the meta map
        const metaMap = $('html').map((_,el)=>
        {
            //Find all meta tags
            el = $(el);
            const meta = el.find(`meta`);

            //Verify for the correct meta tag with the url image of the article
            for(i = 0;i < meta.length;i++){
                if(meta[i].attribs["property"] === "og:image"){ //The article images in the web is tagged with tag og:image , find it and extact
                    imageUrls.push(meta[i].attribs["content"]); //Get the url of images
                }
            }
        }
        ).get();

        //Return the images in an array
        return imageUrls;

    }catch (error){
        console.error(error);
        //Return Empty
        return ""
    }
}

//Get the feed data of the article and return this data is everything is correct and return error if not
async function GetFeedData(res,url){
    let feedData = new FeedData();

    try {
        //Get the feed data of the url
        const data = await read(url);

        feedData.title = data.title; //Set the feed data title
        feedData.link = data.link; //Set the feed data link
        feedData.description = data.description; //Set the feed data description

        let defaultEntries = data.entries; //Get the articles of the feed url
        let entries = []; //Define new article array with the property image url

        //Get the image urls for all articles in the feed
        for (let i = 0; i < defaultEntries.length;i++){
            var images = await GetImageUrlsFromLink(defaultEntries[i].link);

            entries.push(new Entry(defaultEntries[i].title,images,defaultEntries[i].link,defaultEntries[i].description,defaultEntries[i].published))
        }

        //Set articles in the feed data object for returned it
        feedData.entries = entries;

        //Return the complete feed data object
        return feedData;

    }catch (err){
        console.error(err)
        return res.status(400).json(
            {
                "ok":"false",
                "msg":err.toString()
            })
    }
}

//Get the data of the RSS sources
router.get("/",async (req, res) => {
   try {
       res.json(
           {
               /*"Cubadebate" : await GetFeedData(res,"http://localhost/Copiafeed.xml"),
               "Trabajadores" : await GetFeedData(res,"http://localhost/Copiafeed.xml"),
               "Granma" : await GetFeedData(res,"http://localhost/Copiafeed.xml"),*/

               "Cubadebate" : await GetFeedData(res,"http://www.cubadebate.cu/feed/"),
               "Trabajadores" : await GetFeedData(res,"http://www.trabajadores.cu/rss"),
               "Granma" : await GetFeedData(res,"http://www.granma.cu/feed"),
   })
   }catch (error){
       res.status(400).json(
           {
               "ok":"false",
               "msg":error
           })
   }
})

module.exports = router;