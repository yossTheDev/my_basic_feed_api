const axios = require("axios");
const cheerio = require("cheerio");
const FeedParser = require("feedparser");
const fetch = require("node-fetch");

//Feed Data object with the data of the feed url
function FeedData(title, link, description, entries, image){
    this.title = title;
    this.link = link;
    this.description = description;
    this.entries = entries;
    this.image = image;
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
        $('html').map((_,el)=>
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

//Get feed data and the articles
function GetData(url,img,response){
    let feed = new FeedParser(); //Initializing new feed parse instance
    let items = []; //This is the result of all entries in the feed
    let feedData = new FeedData(); //This is the basic information of the feed

    //Get and manage the request
    let req = fetch(url)
    req.then(function (res) {
        if (res.status !== 200) {
            response.json({
                "ok":false,
                "msg":"error"
            })
            //throw new Error('Bad status code');
            //return "";
        }
        else {
            // The response `body` -- res.body -- is a stream
            res.body.pipe(feed);
        }
    }, function (err) {
        // handle any request errors
    });

    //Handle errors in this event
    feed.on('error', function (error) {
        // always handle errors
        res.status(400).json({
            "ok":false,
            "msg":error
        })
    });
    //In this event I take each item in the feed and convert it in an Entry object
    feed.on('readable', function() {
        let stream = this, item;
        while (item = stream.read()){
            let newItem = new Entry(); //Create new entry object

            newItem.title = item.title; //Add the title
            newItem.description = item.description; //Add the description
            newItem.published = item.date; //Add the date time
            newItem.link = item.link //Add the link
            //Adding in our items collection
            items.push(newItem);
        }
    });
    //This Event occurs when meta has been parsed
    feed.on("meta",function (meta) {
        feedData.title = meta.title;
        feedData.link = meta.link;
        feedData.description = meta.description;
        feedData.image = meta.image.url;
    })
    //In this event take all processed data and sent to the user
    feed.on("end",async function () {
        //Get all images for the articles
        if(img === "true")
        {
            for (let i = 0; i < items.length; i++) {
                items[i].image = await GetImageUrlsFromLink(items[i].link);
            }
        }


        //Send Response
        response.json(
            {
                "Feed" : feedData,
                "Items": items
            })
    })
}

module.exports = GetData;