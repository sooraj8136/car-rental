const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log(token,'---Token from userAuth')

        if (!token) {
            return res.status(401).json({ message: "user not autherized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, "-----Decoded User-token");

        if (!decoded) {
            return res.status(401).json({ message: "user not autherized" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" });
    }
};

module.exports = { userAuth }