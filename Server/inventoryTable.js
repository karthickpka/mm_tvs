mongo = require('mongodb')
mongoClient = mongo.MongoClient;
dbName = 'mydb';
collectionName = "dbInventory";
url = "mongodb://localhost:27017/"+dbName


//var dateFormat = require('dateformat');
// View all
viewAll = function(req,res){
    //console.log('View All function')
    mongoClient.connect(url, function(err, db) {
        if (err) console.log(err); //throw err;
        db.collection(collectionName).find().limit(25).sort({Date:-1}).toArray(function(err, result) {
            if (err) console.log(err); //throw err;
            db.close();
            res.send(result);
        });
    }); 
}

//Insert Record
//chasis=123&engine=&model=&date=2018-05-03&mrp=&color=&discount=&comment=&availability=1
insertRecord = function(req,res){
    mongoClient.connect(url, function(err, db) {
        if (err) console.log(err);//throw err;
        var pRecord = {_id:req.query.chasis.toString(),Engine:req.query.engine,Model:req.query.model,Date:req.query.date,
            Mrp:req.query.mrp,Color:req.query.color,
            Comment:req.query.comment,Availability:parseInt(req.query.availability)};
        db.collection(collectionName).insert(pRecord,function(err,result){
            db.close();
            if(err) res.status(400).send("Record with same Chasis Already exists;\nThis is Error Message:\n"+err);
            else
            res.send('Record Added')
        })
    }); 
}

//Update Record
updateRecord = function(req,res){
    //console.log('Update record function')
    mongoClient.connect(url, function(err, db) {
        if (err) console.log(err); //throw err;
        //console.log(Object.keys(req.query).length)

        if(Object.keys(req.query).length==2)
            {
                pRecord = {_id:req.query.chasis.toString(),Availability:parseInt(req.query.availability)};
            }
        else
            {
                // to update
             var pRecord = {_id:req.query.chasis.toString(),Engine:req.query.engine,Model:req.query.model,Date:req.query.date,
                Mrp:req.query.mrp,Color:req.query.color,
                Comment:req.query.comment,Availability:parseInt(req.query.availability)};
            }
            
        db.collection(collectionName).update({_id:req.query.chasis.toString()},{$set: pRecord},function(err,result){
            if(err) console.log(err); //throw err;
            db.close();
            res.send('Record Updated')
        })
    }); 
}

//delete Record
deleteRecord = function(req,res){
//console.log('Delete Record');

mongoClient.connect(url, function(err, db) {
        if (err) console.log(err); //throw err;
        //console.log(req.query.sparesflag.toString())
        db.collection(collectionName).remove({_id:req.query.chasis.toString()},function(err,result){
            if(err) console.log(err); //throw err;
            db.close();
            res.send('Record removed')
        })
    });
};

searchRecord = function(req,res){
///console.log('Search Record');
mongoClient.connect(url, function(err, db) {
        if (err) console.log(err); //throw err;
        var query = {}
 
        if(req.query.name)
             query[req.query.name]= new RegExp(req.query.value,"i");
        else
            query = {Availability: {$gt: 0} }
        db.collection(collectionName).find(query).sort({Date:-1,Availability:-1}).toArray(function(err, result) {
            if (err) console.log(err); //throw err;
            db.close();
            res.send(result);
        });
    }); 
};

/*summary = function(req,res)
{
    query = {}
    if(req.query.ShopName!="All" && req.query.ShopName)
             query["ShopName"]=req.query.ShopName;
mongoClient.connect(url,function(err,db){
     if (err) console.log(err); //throw err;

      db.collection(collectionName).aggregate([{$match: query},{ $group: { _id: "$Model", total:{$sum: "$Availability" }}}]).sort({_id:1}).toArray(function(err,result){
        if (err) console.log(err); //throw err;    
        res.send(result)
        db.close();
     })
});
}
*/
modelPrice = function(req,res)
{
    mongoClient.connect(url, function(err, db) {
        if (err) console.log(err); //throw err;
            
        db.collection(collectionName).update(
          {Model: req.query.model.toString(),Availability:1},
          {$set: { Mrp: req.query.mrp } },
          {"multi":true},function(err,result){
            if(err) console.log(err); //throw err;
            db.close();
            res.send('Model Price Updated')
        })
    }); 
}

module.exports.viewAll = viewAll;
module.exports.insertRecord = insertRecord;
module.exports.updateRecord = updateRecord;
module.exports.deleteRecord = deleteRecord;
module.exports.searchRecord = searchRecord;
//module.exports.summary = summary;
module.exports.modelPrice = modelPrice;