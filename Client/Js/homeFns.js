var setDate = function(){
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        document.getElementById("date").value = [year, month, day].join('-');
        document.getElementById("startDate").value = [year, month, day].join('-');  
        document.getElementById("endDate").value = [year, month, day].join('-');
    }




function Search(pTable){
//http://localhost:4444/searchRecord?name=Comment&value=abc
    var xmlHttp = new XMLHttpRequest();
    if(document.getElementById("SearchValue").value)
    {

    queryString= "/"+pTable+"?name="+document.getElementById("Name").value+"&value="+document.getElementById("SearchValue").value;
    document.getElementById("SearchValue").value ="";
    }
    else
    {
      queryString= "/"+pTable+"?startdate="+document.getElementById('startDate').value+"&enddate="+document.getElementById('endDate').value;
      if(document.getElementById("onlyCredit").checked)
      queryString +="&checked=true";
      //alert("Enter Value in Search Box")
      //return;
    }
    xmlHttp.open( "GET", queryString, false ); // false for synchronous request
    xmlHttp.send();
    myList = JSON.parse(xmlHttp.responseText);
    //alert(myList)
    
    // Update Summary
    /*document.getElementById("Summary").innerHTML="Total / Sold / Unsold : " +
        myList.length + " / " +
        myList.filter(function(tmp){ return tmp.Availability=="0"}).length + " / " +
        myList.filter(function(tmp){ return tmp.Availability>0}).length*/ 
    document.getElementById("Summary").hidden = false;

    document.getElementById("excelDataTable").innerHTML="";
    buildHtmlTable(myList,'#excelDataTable');
}
function viewAll(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/viewAll", false ); // false for synchronous request
    xmlHttp.send();
    myList = JSON.parse(xmlHttp.responseText);
    document.getElementById("excelDataTable").innerHTML="";
    buildHtmlTable(myList,'#excelDataTable');    
  
    //var sold = myList.filter(function(tmp){ return tmp.Availability=="Sold"}).length;
   //Calculate Summary
   document.getElementById("Summary").hidden = false;
    document.getElementById("Summary").innerHTML="Total / Sold / Unsold : " +
        myList.length + " / " +
        myList.filter(function(tmp){ return tmp.Availability=="0"}).length + " / " +
        myList.filter(function(tmp){ return tmp.Availability>0}).length 
    
// Reset Input box values
    resetInputFields();

}

function buildHtmlTable(myList,selector) {
     
  var columns = addAllColumnHeaders(myList, selector);

  for (var i = 0; i < myList.length; i++) {
    var row$ = $('<tr/>');
    for (var colIndex = 0; colIndex < columns.length; colIndex++) {
      //alert(typeof(myList[i][columns[colIndex]]))
      var cellValue = myList[i][columns[colIndex]];
      
      if(typeof(myList[i][columns[colIndex]])=='object')
       { cellValue = JSON.stringify(myList[i][columns[colIndex]]);
      //  / alert(cellValue)
       /* cellValue=JSON.stringify(myList[i][columns[colIndex]]).replace("{\"Model\":\"","")
         .replace("\",\"Availability\":\"","-").replace("\"}","")*/
       }
      if (cellValue == null) cellValue = "";
      row$.append($('<td/>').html(cellValue));
    }
    $(selector).append(row$);
  }
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records.
function addAllColumnHeaders(myList, selector) {
  var columnSet = [];
  var headerTr$ = $('<tr/>');

  for (var i = 0; i < myList.length; i++) {
    var rowHash = myList[i];
    for (var key in rowHash) {
      if ($.inArray(key, columnSet) == -1) {
        columnSet.push(key);
        headerTr$.append($('<th/>').html(key));
      }
    }
  }
  $(selector).append(headerTr$);

  return columnSet;
}
function resetInputFields(){
    setDate();
    document.getElementById("chasis").value ="";
    document.getElementById("engine").value ="";
    document.getElementById("model").value ="";
    document.getElementById("mrp").value ="";
    document.getElementById("color").value ="";
    document.getElementById("comment").value="";
}

function goToBilling()
{
  //window.location.href = "/billing";
  if(document.getElementById("chasis").value )
    {
        var queryString="/searchRecord?name=_id&value="+ document.getElementById("chasis").value;   
       
        var xmlHttp = new XMLHttpRequest();
        //var queryString="/searchRecord?name=_id&value="+ document.getElementById("IMEI").value;
        xmlHttp.open( "GET", queryString, false ); // false for synchronous request
        xmlHttp.send();
        //alert(JSON.parse(xmlHttp.responseText).length)
        if(JSON.parse(xmlHttp.responseText).length>0)
          window.location.href = "/billing?chasis="+document.getElementById("chasis").value;
        else
        {//alert("Search Inside Billing Table:"+JSON.parse(xmlHttp1.responseText).length)
          queryString="/searchBillingRecord?name=_id&value="+ document.getElementById("chasis").value;
          var xmlHttp1 = new XMLHttpRequest();
          xmlHttp1.open( "GET", queryString, false ); // false for synchronous request
          xmlHttp1.send();

          if(JSON.parse(xmlHttp1.responseText).length>0){
           window.location.href = "/billing?chasis="+document.getElementById("chasis").value;
           getProdDetails();}
          else
           alert("Given Chasis No is not in inventory")
        }  
    }
  else
    alert("Please enter Chasis Num to bill");

  //resetInputFields();
}


function Summary(){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "/summary?ShopName="+document.getElementById("ShopName").value, false ); // false for synchronous request
    xmlHttp.send();
    myList = JSON.parse(xmlHttp.responseText);
    document.getElementById("Summary").hidden = false;
    document.getElementById("excelDataTable").innerHTML="";
    //document.getElementById("Summary").innerHTML=JSON.stringify(myList)    
    buildHtmlTable(myList,'#excelDataTable'); 
}

function DailySummary()
{
  //alert(document.getElementById("Date").value)
  if(document.getElementById("Date").value=="")
    {
      alert("Enter Date to get Daily Summary")
    }
    else
      {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", "/dailySummary?date="+document.getElementById("Date").value+"&ShopName="+document.getElementById("ShopName").value, false ); // false for synchronous request
      xmlHttp.send();
      myList = JSON.parse(xmlHttp.responseText);
      var total=0;
      for(i=0;i<myList.length;i++)
        {
            total = +total + +myList[i]["SellingPrice"];
        }
      document.getElementById("Summary").hidden = false;
      document.getElementById("Summary").innerHTML = "Sales Amount For Day: "+total;
      document.getElementById("excelDataTable").innerHTML="";
      //document.getElementById("Summary").innerHTML=JSON.stringify(myList)    
      buildHtmlTable(myList,'#excelDataTable'); 
      }
}
function ModelSummary()
{
  //alert(document.getElementById("Date").value)
  if(document.getElementById("Date").value=="")
    {
      alert("Enter Date to get Model Summary")
    }
    else
      {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", "/modelSummary?date="+document.getElementById("Date").value+"&ShopName="+document.getElementById("ShopName").value, false ); // false for synchronous request
      xmlHttp.send();
      myList = JSON.parse(xmlHttp.responseText);
      var total=0;
      for(i=0;i<myList.length;i++)
        {
            total = +total + +myList[i]["SellingPrice"];
        }
      document.getElementById("Summary").hidden = false;
      document.getElementById("Summary").innerHTML = "Sales Amount For Day: "+total;
      document.getElementById("excelDataTable").innerHTML="";
      //document.getElementById("Summary").innerHTML=JSON.stringify(myList)    
      buildHtmlTable(myList,'#excelDataTable'); 
      }
}
function editModelPrice()
{
  if(document.getElementById("model").value && document.getElementById("mrp").value)
  {
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET", "/modelPrice?model="+document.getElementById("model").value+"&mrp="+document.getElementById("mrp").value, false ); // false for synchronous request
      xmlHttp.send();
      alert(xmlHttp.responseText)
  }
  else
  {alert("Model And Price Value are Required to update")}
}
