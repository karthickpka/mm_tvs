const http = require('http')
const express = require('express')
var dbFns = require('./Server/inventoryTable.js')
var billFns = require('./Server/billingTable.js')
const app = express()
var port = 4444;

// compress all requests 
//app.use(compression())

// Home Page
app.use('/',express.static(__dirname+'//Client'));
app.get('/',function(req,res){
                res.sendFile(__dirname+'//Client//Home.html')
        })

// Billing Page
//app.use('/billing',express.static(__dirname+'//Client'));
app.get('/billing',function(req,res){
        res.sendFile(__dirname+'//Client//Billing.html')
        })
app.get('/insertBilling',function(req,res){
        billFns.insertBillingRecord(req,res);
        })
app.get('/searchBillingRecord',function(req,res){
        billFns.searchBillingRecord(req,res);
        })
app.get('/dailySummary',function(req,res){
        billFns.dailySummary(req,res);    
})
app.get('/modelSummary',function(req,res){
        billFns.modelSummary(req,res);    
})

app.get('/updatePaid',function(req,res){
        billFns.updatePaid(req,res);    
})

// Inventory Page

app.get('/modelPrice',function(req,res){
        dbFns.modelPrice(req,res);
})
app.get('/viewAll',function(req,res){
        dbFns.viewAll(req,res);
        })

app.get('/insertRecord',function(req,res){
        dbFns.insertRecord(req,res);      
        })

app.get('/updateRecord',function(req,res){
        dbFns.updateRecord(req,res);
        })

app.get('/deleteRecord',function(req,res){
        dbFns.deleteRecord(req,res);
        })
app.get('/searchRecord',function(req,res){
        dbFns.searchRecord(req,res);
        })

app.get('/Summary',function(req,res){
        dbFns.summary(req,res);})



app.post('/',function(req,res){res.send('POST Request')})

var server = app.listen(port,function(){console.log('Server running on '+port)})