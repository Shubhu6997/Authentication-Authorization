const Middelware = {
    authCheck(req, res, next){
        const token  = req.headers["auth-token"];
        if(token)
        {
            try {
                //throw error if token is invalid
                req.user = jwt.verify(token, process.env.JWT_SECRET);  
                next();
            } catch (error) {
                res.sendStatus(401); 
            }
        }
        else
        {
            res.sendStatus(401);
        }    
    },
    logging(req, res, next){
        console.log(`[${new Date()}] - ${req.user.userId} - ${req.url} - ${req.method}`);
        next();
    }
}

module.exports = Middelware;