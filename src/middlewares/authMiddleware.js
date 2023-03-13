const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = authHeader && authHeader.split(" ")[1];

        // check if user send token via authorization header or not
        if (!token) {
            // rejected request and send response access denied
            return res.status(401).send({
                status: "Failed",
                message: "Access Denied!",
            });
        }
        
        const verified = jwt.verify(token, process.env.SECRET_KEY); //verified token
        req.user = verified;
        next(); // if token valid go to the next request

    } catch (error) {
        // if token invalid send response invalid token
        console.log(error);
        res.status(400).send({
            status: "Failed",
            message: "Invalid Token",
        });
    }
};