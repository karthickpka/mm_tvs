var setDate = function(){
        var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
       // console.log([year, month, day].join('-'))
        document.getElementById("date").value = [year, month, day].join('-');
    }   

function recalculate()
   {
       var tmp = +document.getElementById('Mrp').value - +document.getElementById('Discount').value;
       //document.getElementById('Mrp').value = tmp
       //document.getElementById('Taxable').value= tmp
       document.getElementById('Total').value= (+tmp).toFixed(2)
       document.getElementById('Roundoff').value = (+document.getElementById('Total').value).toFixed(0)
       document.getElementById('Credit').value = (+document.getElementById('Roundoff').value) - document.getElementById('Paid').value;
       
       document.getElementById('Nettotal').value = (+document.getElementById('Roundoff').value).toFixed(0)
       document.getElementById('Netinwords').innerHTML = convertNumberToWords(+document.getElementById('Nettotal').value);
       // Calculate total in words
    }
function convertNumberToWords(amount) {
    var words = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp = amount.split(".");
    var number = atemp[0].split(",").join("");
    var n_length = number.length;
    var words_string = "";
    if (n_length <= 9) {
        var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        value = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}


function getProdDetails()
    {
        setDate();
        
        //alert("temp:"+window.location.toString().split("=")[1].split("_")[0]);
        var xmlHttp = new XMLHttpRequest();
        var queryString="/searchRecord?name=_id&value="+ window.location.toString().split("=")[1].split("_")[0];
        xmlHttp.open( "GET", queryString, false ); // false for synchronous request
        xmlHttp.send();
        temp = JSON.parse(xmlHttp.responseText);
        document.getElementById("Chasis").value = temp[0]["_id"]
        document.getElementById("Model").value=temp[0]["Model"]
        document.getElementById("Model1").value=temp[0]["Model"]
        document.getElementById("Mrp").value=temp[0]["Mrp"]
       // document.getElementById("Discount").value=temp[0]["Discount"]
        document.getElementById("Engine").value=temp[0]["Engine"]
      //  document.getElementById("Cgst").value=temp[0]["Mrp"] * 0.14
       // document.getElementById("Sgst").value=temp[0]["Mrp"] * 0.14

       // document.getElementById("Taxable").value=temp[0]["Mrp"]
        document.getElementById("Total").value = document.getElementById("Mrp").value 
                                                    - document.getElementById("Discount").value //+ 2 * temp[0]["Mrp"] * 0.14
        document.getElementById('Roundoff').value = (+document.getElementById('Total').value).toFixed(0)
        document.getElementById('Nettotal').value = (+document.getElementById('Roundoff').value).toFixed(0)
        document.getElementById('Netinwords').innerHTML = convertNumberToWords(+document.getElementById('Nettotal').value);

       // alert("Check Avail:"+temp[0]["Availability"]);

        if(temp[0]["Availability"]<1)
            {
                //alert("already Sold")
                // Disable Div
                document.getElementById("sellPrint").innerHTML="Print Bill";

                var elems = document.getElementsByTagName('input');
                var len = elems.length;
                
                for (var i = 0; i < len; i++) {
                  // elems[i].style = "background-color: transparent;border:0;";
                        elems[i].disabled = true;
                }
                document.getElementById("Paid").disabled = false;

                    
                var xmlHttp1 = new XMLHttpRequest();
                var queryString1="/searchBillingRecord?name=_id&value="+ window.location.toString().split("=")[1];
                xmlHttp1.open( "GET", queryString1, false ); // false for synchronous request
                xmlHttp1.send();
                tempBill = JSON.parse(xmlHttp1.responseText);
                //alert(tempBill[0]["Invoicenumber"])
                document.getElementById("date").value = tempBill[0]["Date"]
                document.getElementById("Customername").value = tempBill[0]["CustName"]
                document.getElementById("Contact").value = tempBill[0]["CustContact"]
                document.getElementById("Address").value = tempBill[0]["CustAddress"]
                document.getElementById("Invoicenumber").innerHTML = tempBill[0]["Invoicenumber"]
                document.getElementById("Mrp").value = tempBill[0]["MRP"]
                document.getElementById("Discount").value = tempBill[0]["Discount"]//temp[0]["Mrp"] - tempBill[0]["SellingPrice"];//temp[0]["MRP"] - tempBill[0]["SellingPrice"]
                document.getElementById("Paid").value=tempBill[0]["Paid"]
                recalculate();
                //alert("Here:"+tempBill[0]["SellingPrice"])
                // Get Customer Details from billing table
            }
        else if(!document.getElementById("Invoicenumber").innerHTML)
        {
           // alert('no bill no')
            var xmlHttp1 = new XMLHttpRequest();
            xmlHttp1.open( "GET", "/searchBillingRecord", false ); // false for synchronous request
            xmlHttp1.send();
            //alert(xmlHttp1.responseText)
            document.getElementById("Invoicenumber").innerHTML = parseInt(xmlHttp1.responseText) + 1;
        }
        else
         ;//This is to handle get bill only for first time; alert('unknown error')
    }
        

function sellFunction(){
        // Insert into Billing Table
        //alert("Sell For:"+document.getElementById("Selling Price").value);
    if(document.getElementById('sellPrint').innerHTML=="Sell And Print Bill")
            {
            var sellConfirm = confirm("Sell For:"+document.getElementById("Nettotal").value);
            if(sellConfirm)
            {
            var xmlHttp = new XMLHttpRequest();
            var queryString="/insertBilling?chasis="+document.getElementById("Chasis").value+
                            "&invoicenumber="+document.getElementById("Invoicenumber").innerHTML+
                            "&model="+document.getElementById("Model").value+
                            "&date="+document.getElementById("date").value +
                            "&name="+document.getElementById("Customername").value +
                            "&contact="+document.getElementById("Contact").value +
                            "&address="+document.getElementById("Address").value +
                            "&mrp="+document.getElementById("Mrp").value +
                            "&discount="+document.getElementById("Discount").value+
                            "&paid="+document.getElementById("Paid").value
            //alert(document.getElementById("Selling Price").innerHTML)
            xmlHttp.open( "GET", queryString, false ); // false for synchronous request
            xmlHttp.send();
            //alert(xmlHttp.responseText)

            // Update Inventory table
            queryString1  = "/updateRecord?chasis="+temp[0]["_id"] +
                            "&availability="+(parseInt(temp[0].Availability)-1).toString();   
            var xmlHttp1 = new XMLHttpRequest();
            xmlHttp1.open( "GET", queryString1, false ); // false for synchronous request
            xmlHttp1.send();
            //alert(xmlHttp1.responseText);
            getProdDetails();

            // Remove Background
            var elems = document.getElementsByTagName('input');
            var len = elems.length;
            for (var i = 0; i < len; i++) {
                if(elems[i].value.indexOf("Print Bill")>=0)
                    ;
                else{//elems[i].style = "background-color: transparent;border:0;";
                    elems[i].disabled = true;}
                }
            window.print();
            }           
            }
    else
        window.print();
        
     
}

function updateCredit()
{
    if(document.getElementById('sellPrint').innerHTML=="Sell And Print Bill")
        {alert('Billing not yet done - Cannot update credit for this product')
        return;}
    else{
            //Prompt for Password
            var pwd = prompt("EnterPWD:")
            if(pwd !="123")
            {   alert("invalid Password")
                return;
            }
            var xmlHttp = new XMLHttpRequest();
            var queryString="/updatePaid?chasis="+document.getElementById("Chasis").value+"&paid="+document.getElementById("Paid").value
            xmlHttp.open( "GET", queryString, false ); // false for synchronous request
            var sellConfirm = confirm("Confirm ??   Total Paid amount:"+document.getElementById("Paid").value);
            if(sellConfirm)
            {    
                xmlHttp.send();
                alert(xmlHttp.responseText+": Credit Balance:"+document.getElementById("Credit").value)
            }
        }
}