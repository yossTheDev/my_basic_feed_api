const express = require("express");
const app = express();

//Configs
app.set("port",process.env.PORT||3000);
app.set("json spaces",2);


//Middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(require(`./routes/index`));
app.use(require(`./routes/getfeed`));


//Initializing server and listening port
app.listen(app.get("port"),()=>{
    console.log(`Server listening on port localhost:${app.get(`port`)}"`);});
