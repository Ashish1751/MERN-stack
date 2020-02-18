const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Citem = require('../../models/Citem');

router.get('/', (req,res) => {
    if(req.query.show === "0"){
        Citem.find({"email": req.query.email, "status": "Ordered"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "1"){
        Citem.find({"email": req.query.email, "status": "Ready to Dispatch"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "2"){
        Citem.find({"email": req.query.email, "status": "Dispatched"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
});

router.post('/add', auth, (req,res) => {
    const newItem = new Citem({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        status: req.body.status,
        email: req.body.email,
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(err => {
            res.status(400).send(err);
    });
});

router.delete('/:id', auth,  (req,res) => {
    Ctem.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

module.exports = router;