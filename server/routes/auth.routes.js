const express = require('express')
const authCtrl = require('../controllers/auth.controller')
const router = express.Router()

router.route('/auth/sighin')
    .post(authCtrl.signin)
router.route('/auth/signout')
    .post(authCtrl.signout)


module.exports = router