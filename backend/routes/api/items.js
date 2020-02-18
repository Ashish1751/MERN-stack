const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Item = require('../../models/Item');

router.get('/', (req,res) => {
    if(req.query.show === "0"){
        Item.find({"email": req.query.email,"status": {$in:["Ordered","Cancelled"]}})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "1"){
        Item.find({"email": req.query.email, "status": "Ready to Dispatch"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "2"){
        Item.find({"email": req.query.email, "status": "Dispatched"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
});

router.get('/citems', (req,res) => {
    if(req.query.show === "0"){
        Item.find({"bought.customer": req.query.email,"status": "Ordered"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "1"){
        Item.find({"bought.customer": req.query.email, "status": "Ready to Dispatch"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "2"){
        Item.find({"bought.customer": req.query.email, "status": "Dispatched"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
    if(req.query.show === "3"){
        Item.find({"bought.customer": req.query.email, "status": "Cancelled"})
            .sort({ quantity: 1 })
            .then(items => res.json(items))
    }
});

router.post('/edit', (req,res) => {
    var myquery = {"name":req.body.name, "quantity": req.body.quantity,"price": req.body.price, "available":req.body.available,"email": req.body.email, "bought.customer":req.body.cemail};
    var newavailable = (req.body.oquantity)-(req.body.quant);
    console.log(myquery);
    console.log(newavailable);
    var newvalues ={ "status":"Ordered",$set:{ "bought.$.quantity": Number(req.body.quant)}, $inc:{"available":newavailable}};
    if(req.body.available===(newavailable)*(-1)){
        newvalues ={ "status":"Ready to Dispatch", $set:{"bought.$.quantity": Number(req.body.quant)},$inc:{"available":newavailable}};
    }
    console.log(newvalues);
    Item.updateOne(myquery, newvalues)
        .then(item => {res.json(item), console.log(item)})
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.get('/cust', (req,res) => {
    // console.log(req.query.name);
    Item.find({"name": {$regex:req.query.name,$options:"$i"},"available":{$gt:0}})
            .then(items => res.json(items))
});

router.post('/add', (req,res) => {
    const newItem = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        available:req.body.quantity,
        email: req.body.email
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
    });
});

router.post('/purchase', (req,res) => {
    var myquery = {"name":req.body.name, "quantity": req.body.quantity,"price": req.body.price, "available":req.body.available,"email": req.body.email, };
    var newvalues ={ $inc:{"available":(req.body.quant)*(-1)}, $push:{"bought":{"customer":req.body.cemail,"quantity":req.body.quant}}};
    if(req.body.available===req.body.quant){
        newvalues ={ "status":"Ready to Dispatch",$inc:{"available":(req.body.quant)*(-1)}, $push:{"bought":{"customer":req.body.cemail,"quantity":req.body.quant}}};
    }
    Item.updateOne(myquery, newvalues)
        .then(item => res.json(item))
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/cancel', (req,res) => {
    var myquery = {"name":req.body.name, "quantity": req.body.quantity,"price": req.body.price, "available":req.body.available,"email": req.body.email};
    var newvalues ={ "status":"Cancelled", "available":"0" };
    Item.updateOne(myquery, newvalues)
        .then(item => {res.json(item), console.log(item)})
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/dispatch', (req,res) => {
    var myquery = {"name":req.body.name, "quantity": req.body.quantity,"price": req.body.price, "available":req.body.available,"email": req.body.email};
    var newvalues ={ "status":"Dispatched" };
    Item.updateOne(myquery, newvalues)
        .then(item => {res.json(item), console.log(item)})
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.delete('/:id', auth,  (req,res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

module.exports = router;