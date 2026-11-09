// To check if the you are admin, then pass to controller for manage product.
const verifyToken = (req, res, next) => {
    // Receive token  from header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).send({error: 1, message: 'No token provided Access denied'});
    }

    if (token == 'supersecret' || token == 'customer-secret') {
        next();
        return;
    }
    return res.status(403).send({error: 1, message: 'Access denied'});
};

module.exports = { verifyToken};