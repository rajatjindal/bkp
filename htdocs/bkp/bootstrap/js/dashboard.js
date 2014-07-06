function setCookie(cname, cvalue, exhrs) {
    var d = new Date();
    d.setTime(d.getTime() + (exhrs*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

var displayModules = function () {
    var modules = getCookie("modules").split(',');
    if (modules.length <= 0 || (modules.length == 1 && modules[0] == "")) {
        window.location = "/bkp/login.html";
        return;
    }
    for(var i=0; i<modules.length; i++) {
        $( "<li><a href='#" + modules[i] + "'>" + modules[i] + "</a></li>" ).appendTo( "#modules" );
    }
    
    getJobs(modules[0]);
}

var getJobs = function (moduleName) {
    var d = new Date();
    var day = d.getDate(); if (day <=9) { day = "0" + day }
    var month = d.getMonth() + 1; if (month <=9) { month = "0" + month }
    //var date = month + "-" + day + "-" + d.getUTCFullYear();
    var date = month + "-" + "05" + "-" + d.getUTCFullYear();
    
    var form_data = JSON.stringify({
        "date": date,
        "module": moduleName
    });
    var form_url = "/cgi-bin/index.pl/getJobs";
    var form_method = "POST";
    $.ajax({
        url: form_url, 
        type: form_method,      
        data: form_data,     
        cache: false,
        beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
        success: function(data, textStatus, xhr) {
            displayJobs(data);
        }
    });    
}

var displayJobs = function (data) {
    $( "<table id='datatable' class='table table-bordered'></table>" ).appendTo( "#starter-template" );
    $( "<tr id='header'><th> Job Name</th> <th> Job Desc </th> <th> No of sheets to be printed </th> <th> Start Time</th> <th> End Time </th> <th> No of sheets printed</th> </tr>" ).appendTo( "#datatable" );
    var rowCount = 0;
    jQuery.each(data, function () {
        jQuery.each(this, function(machineType, rows) {
            var rowId = "row_" + rowCount;
            $( "<tr id='row_" + rowCount + "'><td colspan=6><table data-machinetype='" + machineType + "' class='table table-striped'></table></td></tr>").appendTo( "#datatable" );
            
            rowCount = rowCount + 1;
            rowId = "row_" + rowCount;
            var buttonTH = "buttonth_" + rowCount;
            $( "<tr id='row_" + rowCount + "'><th>" + machineType + "</th><th id=" + buttonTH + "></th><th colspan=4>&nbsp;</th></tr>" ).appendTo( $("table").find('[data-machineType="' + machineType + '"]'));
            
            $("<button class='btn btn-default align-left' type='submit'>New</button>").appendTo("#" + buttonTH);
            $("<button class='btn btn-default align-left' type='submit'>Edit</button>").appendTo("#" + buttonTH);
            $("<button class='btn btn-default align-left' type='submit'>Delete</button>").appendTo("#" + buttonTH);
            
            jQuery.each(rows, function () {
                var value = this;
                
                rowCount = rowCount + 1;
                var rowId = "row_" + rowCount;
                $("<tr id='row_" + rowCount + "'></tr>" ).appendTo( "#datatable" );
                
                $("<td>" + value['Job Name'] + "</td>").appendTo("#" + rowId);   
                $("<td>" + value['Job Desc'] + "</td>").appendTo("#" + rowId);   
                $("<td>" + value['No of sheets to be printed'] + "</td>").appendTo("#" + rowId);   
                $("<td><input id=timepicker1 type=text class='input-small' value='" + value['Job put on the machine at'] + "'><span class='add-on'><i class='icon-time'></i></span></td>").appendTo("#" + rowId);   
                $("<td>" + value['Job put off the machine at'] + "</td>").appendTo("#" + rowId);   
                $("<td>" + value['No of sheets Printed'] + "</td>").appendTo("#" + rowId);
            })
        })
    }); 
    $('#datatable tr').on('click', function(event) {
        $(this).addClass('highlight').siblings().removeClass('highlight');
    });
    
    $('#timepicker1').timepicker();
}

$(document).ready(function(e) {
    displayModules();
});