const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth')

const User = require('../../models/user');

router.post('/', (req, res) => {
    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if(!user) return res.status(400).json({ msg:"User doesnot exists" })
            
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

                    jwt.sign(
                        { id: user.id },
                        'sl_myJwtSecret',
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.username,
                                    email: user.email,
                                    type: user.user_type
                                }
                            });
                        }
                    )
                })
        })
});

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
});

module.exports = router;