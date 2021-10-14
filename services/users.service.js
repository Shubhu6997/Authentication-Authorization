
const db = require("../Shared/mongo");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const {registerSchema, loginSchema} = require("../Shared/schema");

const services = {
    async register(req, res){
        try {
            //Request body validation

            let {error, value} = await registerSchema.validate(req.body);
            console.log(value);
            console.log(error);
            if(error){
                return res.status(400).send({
                    error : "validation Failed",
                    message : error.details[0].message
                })
            }

            //Check EmailId exists or not
            const user  = await db.users.findOne({email : value.email});
            console.log(user);
            if(user)
                return res.status(400).send({error : "User already exists"});
            
            //Generate Salt 
            const salt = await bcrypt.genSalt();
            value.password = await bcrypt.hash(value.password, salt);
            console.log(value);

            //Insert user
            await db.users.insertOne(value);

            res.send({message : "User registered successfully"});        
            
        } catch (error) {
            console.log("Error while registering user : ", error);
            res.sendStatus(500);  
        }
    },

    async login(req, res){
        try {
            //Request body validation
            let {error, value} = await loginSchema.validate(req.body);
            console.log(value);
            console.log(error);
            if(error){
                 return res.status(400).send({
                     error : "validation Failed",
                     message : error.details[0].message
                })
            }

            //Check EmailId exists or not
            const user  = await db.users.findOne({email : req.body.email});
            console.log(user);
            if(!user)
                return res.status(400).send({error : "User does not exists"});

            //Compare password
            const isValid = await bcrypt.compare(req.body.password, user.password);
            console.log(isValid);

            if(!isValid)
                return res.status(403).send({error : "Email or Password Invalid"});
            
            //Generate Token
            const authToken = jwt.sign(
                {userId : user._Id, email : user.email},
                JWT_SECRET
            );

            console.log(authToken);

            res.send({authToken}); 
           
        } catch (error) {
            console.log("Error while login user : ", error);
            res.sendStatus(500);  
        }
    }  
}

module.exports = services;