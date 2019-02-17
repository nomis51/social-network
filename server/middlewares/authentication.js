const jwt = require('jsonwebtoken');
const config = require('../helpers/config');

const auth = {
    middleware: (req, res, next) => {
        const authHeader = req.get('Authorization');
        
        
        if (!authHeader) {
            req.isAuthenticated = false;
            return next();
        }
        
        const token = authHeader.split(' ')[1];
        
        const decodedToken = auth.validateToken(token);
        
        if (!decodedToken) {
            req.isAuthenticated = false;
            return next();
        }
        
        req.isAuthenticated = true;
        req.user_id = decodedToken.user_id;
        next();
    },
    
    validateToken: (token) => {
        if (!token || token === '') {
            return false;
        }
        
        try {
            decodedToken = jwt.verify(token, config.token.key);
        } catch (err) {
            return false;
        }
        
        if (!decodedToken) {
            return false;
        }
        
        return decodedToken;
    }
};

module.exports = auth;