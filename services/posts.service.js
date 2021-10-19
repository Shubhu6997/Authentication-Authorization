
const db = require("../Shared/mongo");

const {ObjectId} = require("mongodb");

const services = {
    async findPosts(req, res){
        try {
            console.log(req.user);
            console.log("GET method is called");
            //to get parameters from URl http://localhost:3001/posts?sort=asc&name=shubham
            console.log(req.query);
            //db.posts.find()
            const data = await db.posts.find({userId : req.user.userId}).toArray();//Coverted seperate JSONs into array
            console.log(data);
            res.send(data);
            
        } catch (error) {
            console.log("Error while reading : ", error);
            res.sendStatus(500);  
        }
    },

    async insertPost(req, res){
        try {
            console.log("POST method is called");
            console.log(req.body);
            console.log("req.user : ",req.user);
            //db.posts.insertOne()
            //const data = await db.posts.insertOne({...req.body, userId : req.user._id});
            const data = await db.posts.insertOne({...req.body});
            console.log(data);
            res.send({_id: data.insertedId ,...req.body});
        } catch (error) {
            console.log("Error while inserting : ", error);
            res.sendStatus(500);  
        }
    },

    async updatePost(req, res){
        try {
            console.log("PUT method is called");
            console.log(req.body);
            //db.posts.findOneAndUpdate()
            const data = await db.posts
                        .findOneAndUpdate(
                            {_id : ObjectId(req.params.id)},
                            {$set:{...req.body}},
                            {returnNewDocument : true}
                        );
            console.log(data);
            res.send({data});
        } catch (error) {
            console.log("Error while updating : ", error);
            res.sendStatus(500);  
        }
    },

    async deletePost(req, res){
        try {
            console.log("DELETE method is called");
            //db.posts.remove()
            console.log(req.param);
            await db.posts.deleteOne({_id : ObjectId(req.params.id)});
            res.end("Deleted Record Successfully");
        } catch (error) {
            console.log("Error while deleting : ", error);
            res.sendStatus(500);  
        }
    }
}

module.exports = services;