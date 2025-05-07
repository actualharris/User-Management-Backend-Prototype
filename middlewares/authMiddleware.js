const jwt = require('jsonwebtoken');
const db = require('../config/db')


const authMiddleware = async (req, res, next)=>{

    let token = req.header('Authorization')
    if (token){
        token = token.replace('Bearer ', '');
    }
    else{
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        const result = await db.query("SELECT id, name, email FROM users WHERE id = $1", [decoded.id])
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = result.rows[0];
        next();

    } catch (error) {
        console.log(error.message);
        
        res.status(401).json({ message: 'Token is not valid' });
    }
}


module.exports = authMiddleware