const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    try {
        const { admin_token: token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Admin token not provided in cookies" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, "-----Decoded Admin-token");

        if (!decoded) {
            return res.status(401).json({ message: "Admin not authorized" });
        }
        if (decoded.role == "user" && decoded.role == "seller") {
            return res.status(403).json({ message: "Only admin can access" });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message || "Internal server Error" });
    }
};

module.exports = { adminAuth }