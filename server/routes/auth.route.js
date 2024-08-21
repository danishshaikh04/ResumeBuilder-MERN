const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const { googleSignIn } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/Signup', signupValidation, signup);

router.post('/google-sign-in', googleSignIn);

module.exports = router;