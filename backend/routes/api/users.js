const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

// Getting all the users
router.get('/', (req, res) => {
    User.find(function(err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    });
});

// Adding a new user
router.post('/add', (req, res) => {
    const { username, email, password, user_type } = req.body

    User.findOne({ email })
        .then(user => {
            if(user) return res.status(400).json({ msg:"User already exists" })
            
            const newUser = new User({username, email, password, user_type});

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {

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
                                            user_type: user.user_type
                                        }
                                    });
                                }
                            )
                        });
                })
            })
        })
});

// Getting a user by id
router.get('/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id, function(err, user) {
        res.json(user);
    });
});

module.exports = router;