const express = require('express')
const authCtrl = require('../controllers/auth.controller')
const router = express.Router()

router.route('/auth/sighin')
    .post(authCtrl)
router.route('/auth/signout')
    .get()