const jwt = require('jsonwebtoken');

const ownerAuth = (req, res, next) => {
    try {
        const { owner_token: token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Owner token not provided in cookies" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, "-----Decoded Owner-token");

        if (!decoded) {
            return res.status(401).json({ message: "Owner not authorized" });
        }
        if (decoded.role == "user" && decoded.role == "admin") {
            return res.status(403).json({ message: "Only owner can access" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" });
    }
};

module.exports = { ownerAuth }