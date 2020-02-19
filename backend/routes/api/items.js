const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../../models/Item');


const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    } else {
        cb(null,false);
    }
}

const upload = multer({storage: storage,
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});

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
            .then(items => {res.json(items)})
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
    Item.find({"email":{$regex: "^"+req.body.email+"$",$options:"$i"}})
    .then(items => {
        Item.find({"name":{$regex: "^"+req.body.name+"$",$options:"$i"}})
            .then(items1 => {
    const newItem = new Item({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        available:req.body.quantity,
        email: req.body.email,
        rating: items.rating,
        ratingno: items.ratingno,
        crating: items1.cratingno,
        cratingno: items1.cratingno,
        review: items1.review
    });

    newItem.save()
        .then(item => res.json(item))
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
    });}) })
});

router.post('/upload',upload.single('productImage'), (req,res) => {
    console.log(req.file);
    console.log(req.body.document);
    console.log((JSON.parse(req.body.document)).name);
    const newItem = new Item({
        name: (JSON.parse(req.body.document)).name,
        quantity: (JSON.parse(req.body.document)).quantity,
        price: (JSON.parse(req.body.document)).price,
        available:(JSON.parse(req.body.document)).quantity,
        email: (JSON.parse(req.body.document)).email,
        productImage: req.file.path
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

router.get('/review', (req,res) => {
    Item.find({"email":req.query.email})
        .then(item => res.json(item))
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/rating', (req,res) => {
    Item.updateMany({"email":req.body.email},{$inc:{"rating":Number(req.body.quan),"ratingno":1}})
        .then(item => res.json(item))
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/prating', (req,res) => {
    Item.updateMany({"name":req.body.name},{$inc:{"crating":Number(req.body.quan),"cratingno":1}})
        .then(item => res.json(item))
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.post('/reviews', (req,res) => {
    console.log(req.body.quant)
    var myquery = {"name":req.body.name, "quantity": req.body.quantity,"price": req.body.price, "available":req.body.available,"email": req.body.email};
    Item.updateOne(myquery,{"review":req.body.quant})
        .then(item => {res.json(item), console.log(item)})
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
        });
});

router.delete('/:id',  (req,res) => {
    Item.findById(req.params.id)
        .then(item => item.remove().then(() => res.json({success: true})))
        .catch(err => res.status(404).json({success: false}));
});

module.exports = router;