const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')

const {registerUser, authUser, getUserProfile} = require('../controllers/userController')

const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(authUser)
router.route('/profile').get(authMiddleware, getUserProfile)


module.exports = router;
