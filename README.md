#My Basic Feed Api
This api is useful for load all feed data of a source.This can extract title,img,description,link,all entries and images of this entries.Easy to use,Made for you 👌

##Endpoints
#Get Feed 
Description:

This endpoint extract all feed data.

Format:

..api/getfeed?url=www.myurl.com&img=true

Parameters:

-Url : The url of the source feed without the https:// or http://

-Img : Define if the api load images of all entries in the feed, this take some extra time to process this request

Example response:

```json
{
  "Feed": {
    "title": "MyFeed",
    "link": "https://www.MyFeed.com/",
    "description": "My Basic Feed",
    "image": "https://www.MyFeed.com/small_icon"
  },
  "Items": [
    {
      "title": "News of today",
      "link": "https://www.MyFeed.com/newsoftoday",
      "description":"Basic Description",
      "published": "2022-02-06T12:55:38.000Z",
      "categories": [
        "News",
        "Today News"
      ],
      "image": [
        "http://www.MyFeed.com/newsoftoday/image.png",
        "http://www.MyFeed.com/newsoftoday/image2.png"
      ]
    }
  ]
}
```

© Made by YOSS - Yoannis Sánchez Soto © 
