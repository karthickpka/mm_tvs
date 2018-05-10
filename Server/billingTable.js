mongo = require('mongodb')
mongoClient = mongo.MongoClient;
dbName = 'mydb';
billCollectionName = "dbBilling";
url = "mongodb://localhost:27017/"+dbName


//var dateFormat = require('dateformat');


//Insert Record
//http://localhost:4444/insertBilling?chasis=&invoicenumber=%3Ci%3EGenerate%20Here%3C/i%3E&model=&date=2018-05-04&name=&contact=&address=&sellingprice=1152
insertBillingRecord = function(req,res){
    //console.log('insert Billing Record function')
    mongoClient.connect(url, function(err, db) {
        if (err) console.log(err);//throw err;
        //var pRecord = {_id:1,Date:Date.now(),Model:"M1",MRP:"0",MOP:"0",Discount:"0"};
        //Date:new Date().toString()
        var pRecord = {_id:req.query.chasis.toString(),Invoicenumber:req.query.invoicenumber,Model:req.query.model,Date:req.query.date,MRP:req.query.mrp,
            Discount:req.query.discount,Paid:req.query.paid,CustName:req.query.name,CustContact:req.query.contact,CustAddress:req.query.address,Lastupdated:new Date()
            };
        db.collection(billCollectionName).insert(pRecord,function(err,result){
            db.close();
            if(err) res.send('Chasis already Billed');//throw err;
            else
            res.send('Record Inserted to Billing')
        })
    }); 
};
searchBillingRecord = function(req,res){
    //console.log('Search Billing Record');
    mongoClient.connect(url, function(err, db) {
            if (err) console.log(err); //throw err;
            var query = {}
            if(req.query.name)
                {
                query[req.query.name]= new RegExp(req.query.value,"i");
                
                if(req.query.value.toString().indexOf("_")>-1){//console.log(req.query.value.toString())
                    query[req.query.name]= new RegExp("^"+req.query.value+"$","i");
                }
                db.collection(billCollectionName).find(query).sort({Date:-1}).toArray(function(err, result) {
                    if (err) console.log(err);//throw err;
                    db.close();
                    res.send(result);
                    });
                }
            else if(req.query.startdate && req.query.enddate)
            {
                //console.log(req.query.startdate);
                //Correct the Query
                query = {Date: {$gte: req.query.startdate,$lte:req.query.enddate}}
                db.collection(billCollectionName).find(query).toArray(function(err, result) {
                    if (err) console.log(err);//throw err;
                    db.close();
                    res.send(result);
                });
                //[{$match: query},{ $group: { _id: "$_id", Credit:{$sum: $Mrp - $Discount - $Paid }}}]).sort({Credit:1}
                /*db.collection(billCollectionName).aggregate([{$match: query},{ $group: { _id: "$_id", Credit:{$subtract: ["$MRP","$Discount"] }}}]).toArray(function(err,result){
                    if (err) console.log(err);//throw err;
                    db.close();
                    res.send(result);
                })*/
            }
            else // Just get the Count of bills
                db.collection(billCollectionName).count(function(err,result){
                    if (err) console.log(err);//throw err;
                    db.close();
                    res.send(result.toString());
                })
        });
}; 


dailySummary = function(req,res)
{
mongoClient.connect(url,function(err,db){
     if (err) console.log(err);//throw err;
    var query = {};
    query["Date"] = req.query.date;
    db.collection(billCollectionName).find(query).sort({_id:1}).toArray(function(err,result){
    if (err) console.log(err); //throw err;    
    res.send(result)
    db.close();
     })
});
}
modelSummary = function(req,res)
{
    //{ShopName:req.query.ShopName}
    query = {};
    if(req.query.ShopName=="All" || !req.query.ShopName)
         ;
    else
         {
             //query["Date"] = req.query.date;
             query["ShopName"]=req.query.ShopName;
         }
//console.log(req.query.date)
mongoClient.connect(url,function(err,db){
     if (err) console.log(err); //throw err;
     db.collection(billCollectionName).aggregate([{$match: query},{ $group: { _id: "$Model", count:{$sum: 1 }}}]).sort({_id:1}).toArray(function(err,result){
        if (err) console.log(err); //throw err;    
        res.send(result)
        db.close();
     })
});
}


updatePaid = function(req,res)
{
    mongoClient.connect(url, function(err, db) {
        if (err) console.log(err);//throw err;
        var pRecord = {Paid:req.query.paid,Lastupdated:new Date()};
        db.collection(billCollectionName).update({_id:req.query.chasis.toString()},{$set: pRecord},function(err,result){
            db.close();
            if(err) res.send('Error in Updating');//throw err;
            else
            res.send('Updated Credit info')
        })
    }); 
    
}
module.exports.insertBillingRecord = insertBillingRecord;
module.exports.searchBillingRecord = searchBillingRecord;
//module.exports.dailySummary = dailySummary;
//module.exports.modelSummary = modelSummary;
module.exports.updatePaid = updatePaid;
//dailySummary