require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongo = require("./Shared/mongo");
const jwt = require("jsonwebtoken");
const {authCheck, logging} = require("./Shared/middleware");

const app = express();


(async()=>{

    try {

        //MongoDB connectivity
        await mongo.connect();

        //Middleware to allow access to APIs
        app.use(cors());

        //Routes
        const postRoute = require("./routes/posts.routes");
        const userRoute = require("./routes/users.routes");

        //Middleware to parse request body into JSON format
        app.use(express.json());


        //Routes
        app.use("/users", userRoute);

        //Middlewares
        app.use(authCheck);//Auth Token Middleware
        app.use(logging); //Logging Middelware


        app.use("/posts", postRoute);
        


        //Server Start
        app.listen(process.env.PORT, ()=>console.log(`Server started at ${process.env.PORT}`));

        
    } catch (error) {
        console.log("Error while starting server : ", error)
        
    }
    

})();


