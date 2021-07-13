module.exports = (req, res, next) => {
    if (!req.headers.key || req.headers.key != process.env.KEY)
        return res.status(403).json({ success: false, message: "Go away" });
    next();
};
