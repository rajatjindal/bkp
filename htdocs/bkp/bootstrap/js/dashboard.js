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

var addJobsListener = function (obj, moduleName) {
    obj.on("click", function(){
        getHeaders(moduleName);
        $("#current_module").remove();
        $("<input id='current_module' type=hidden value='" + moduleName + "'>").appendTo("body");
    });
}

var displayModules = function () {
    var modules = getCookie("modules").split(',');
    if (modules.length <= 0 || (modules.length == 1 && modules[0] == "")) {
        window.location = "/bkp/login.html";
        return;
    }
    for(var i=0; i<modules.length; i++) {
        var obj = $( "<li><a href='#" + modules[i] + "'>" + modules[i] + "</a></li>" );
        addJobsListener(obj, modules[i]);
        obj.appendTo( "#modules" );
    }
   
   getHeaders(modules[0]); 
   $("#current_module").remove();
   $("<input id='current_module' type=hidden value='" + modules[0] + "'>").appendTo("body");
}

function currentDate() {
    var d = new Date();
    var day = d.getDate(); if (day <=9) { day = "0" + day }
    var month = d.getMonth() + 1; if (month <=9) { month = "0" + month }
    //var date = month + "-" + day + "-" + d.getUTCFullYear();
    var date = month + "-" + "14" + "-" + d.getUTCFullYear();
    return date;
}
var getJobs = function (moduleName) {
    
    var form_data = JSON.stringify({
        "date": currentDate(),
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

var submitAddJob = function(machineType) {
    var moduleName = $("#current_module").val();
    var form_data = JSON.stringify({
        "category": machineType,
        "module": moduleName,
        "date": currentDate(),
        "Job Name": $("[id='Job Name']").val(),
        "Job Desc": $("[id='Job Desc']").val(),
        "Number requested": $("[id='Number requested']").val(),
        "Job put on the machine at": $("[id='Job put on the machine at']").val(),
        "Job put off the machine at": $("[id='Job put off the machine at']").val(),
        "Number Achieved": $("[id='Number Achieved']").val(),
    });
    
    var form_url = "/cgi-bin/index.pl/addJob";
    var form_method = "POST";
    $.ajax({
        url: form_url, 
        type: form_method,      
        data: form_data,
        cache: false,
        beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
        error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError)
        },
        success: function(msg) {
            $.unblockUI();
            getHeaders(moduleName);
        }
    });
}

var submitDeleteJob = function(machineType, jobName) {
    var moduleName = $("#current_module").val();
    var form_data = JSON.stringify({
        "category": machineType,
        "module": moduleName,
        "date": currentDate(),
        "Job Name": jobName
    });
    
    var form_url = "/cgi-bin/index.pl/deleteJob";
    var form_method = "POST";
    $.ajax({
        url: form_url, 
        type: form_method,      
        data: form_data,
        cache: false,
        beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
        error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError)
        },
        success: function(msg) {
            $.unblockUI();
            getHeaders(moduleName);
        }
    });
}
var submitEditJob = function(machineType) {
    var moduleName = $("#current_module").val();
    var form_data = JSON.stringify({
        "category": machineType,
        "module": moduleName,
        "date": currentDate(),
        "Job Name": $("[id='Job Name']").val(),
        "Job Desc": $("[id='Job Desc']").val(),
        "Number requested": $("[id='Number requested']").val(),
        "Job put on the machine at": $("[id='Job put on the machine at']").val(),
        "Job put off the machine at": $("[id='Job put off the machine at']").val(),
        "Number Achieved": $("[id='Number Achieved']").val(),
    });
    
    var form_url = "/cgi-bin/index.pl/editJob";
    var form_method = "POST";
    $.ajax({
        url: form_url, 
        type: form_method,      
        data: form_data,
        cache: false,
        beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
        error: function(xhr, ajaxOptions, thrownError) {
            alert(thrownError)
        },
        success: function(msg) {
            $.unblockUI();
            getHeaders(moduleName);
        }
    });
}

var getHeaders = function (moduleName) {
    var form_data = JSON.stringify({
        "module": moduleName
    });
    
    var form_url = "/cgi-bin/index.pl/getHeaders";
    var form_method = "POST";
    $.ajax({
        url: form_url, 
        type: form_method,      
        data: form_data,     
        cache: false,
        beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
        success: function(data, textStatus, xhr) {
            displayHeaders(data);
            getJobs(moduleName);
        }
    });    
}

var displayHeaders = function (data) {
    $("#datatable").remove();
    $( "<table id='datatable' class='table table-bordered'><tr id='header'></tr></table>" ).appendTo( "#starter-template" );
    jQuery.each(data, function(){
        $("<th> " + this + "</th>").appendTo( "#header" );   
    });
    //$( "<tr id='header'><th> Job Name</th> <th> Job Desc </th> <th> Number requested </th> <th> Start Time</th> <th> End Time </th> <th> Number Achieved</th> </tr>" ).appendTo( "#datatable" );
    
}

var displayJobs = function (data) {
    //$("#datatable").remove();
    //$( "<table id='datatable' class='table table-bordered'></table>" ).appendTo( "#starter-template" );
    //$( "<tr id='header'><th> Job Name</th> <th> Job Desc </th> <th> Number requested </th> <th> Start Time</th> <th> End Time </th> <th> Number Achieved</th> </tr>" ).appendTo( "#datatable" );
    var rowCount = 0;
    jQuery.each(data, function () {
        jQuery.each(this, function(machineType, rows) {
            var rowId = "row_" + rowCount;
            $( "<tr id='row_" + rowCount + "'><td colspan=6><table data-machinetype='" + machineType + "' class='table table-striped'></table></td></tr>").appendTo( "#datatable" );
            
            rowCount = rowCount + 1;
            rowId = "row_" + rowCount;
            var buttonTH = "buttonth_" + rowCount;
            $( "<tr id='row_" + rowCount + "'><th>" + machineType + "</th><th id=" + buttonTH + "></th><th colspan=4>&nbsp;</th></tr>" ).appendTo( $("table").find('[data-machineType="' + machineType + '"]'));
            
            $("<button class='btn btn-default align-left' type='submit'>New</button>").on('click', function(e) { e.preventDefault(); addJob(machineType);}).appendTo("#" + buttonTH);
            $("<button class='btn btn-default align-left' type='submit'>Edit</button>").on('click', function(e) { e.preventDefault(); editJob(machineType);}).appendTo("#" + buttonTH);
            $("<button class='btn btn-default align-left' type='submit'>Delete</button>").on('click', function(e) { e.preventDefault(); deleteJob(machineType);}).appendTo("#" + buttonTH);
            
            jQuery.each(rows, function () {
                var value = this;
                
                rowCount = rowCount + 1;
                var rowId = "row_" + rowCount;
                $("<tr name='" + machineType + "' id='row_" + rowCount + "'></tr>" ).appendTo( "#datatable" );
                
                $("<td name='Job Name'>" + value['Job Name'] + "</td>").appendTo("#" + rowId);   
                $("<td name='Job Desc'>" + value['Job Desc'] + "</td>").appendTo("#" + rowId);   
                $("<td name='Number requested'>" + value['Number requested'] + "</td>").appendTo("#" + rowId);   
                $("<td name='Job put on the machine at'><input id=timepicker1 type=text class='input-small' value='" + value['Job put on the machine at'] + "'><span class='add-on'><i class='icon-time'></i></span></td>").appendTo("#" + rowId);   
                $("<td name='Job put off the machine at'>" + value['Job put off the machine at'] + "</td>").appendTo("#" + rowId);   
                $("<td name='Number Achieved'>" + value['Number Achieved'] + "</td>").appendTo("#" + rowId);
            
                $('#datatable tr[name="' + machineType + '"]').on('click', function(event) {
                    $(this).addClass('success').siblings().removeClass('success');
                });
            })
        })
    }); 
    
    $('#timepicker1').timepicker();
}

function deleteJob(machineType) {
    var idd = $('#datatable tr[class="success"][name="' + machineType + '"]').attr('id');
    $("#editdata").remove();
    $("<div id='editdata' style='display:none'><p> Edit Job </p><table id='editdatatable' class='table table-bordered' style='width: 80%; height: 80%; margin: auto;'></table></div>").appendTo("body");
    var rows = new Array();
    rows = $("#" + idd + " td");
    if (rows.length <=0) {
        alert("Select atleast one row to delete");
        return false;
    }
    if (confirm("Are you sure you want to delete this job")) {
        var jobName = $("#" + idd + " td[name='Job Name']").text();
        submitDeleteJob(machineType, jobName);
    }
}


function addJob(machineType) {
    var idd = $('#datatable tr[name="' + machineType + '"]').first().attr('id');
    $("#editdata").remove();
    $("<div id='editdata' style='display:none'><p> Add new Job </p><table id='editdatatable' class='table table-bordered' style='width: 80%; height: 80%; margin: auto;'></table></div>").appendTo("body");
    var rows = new Array();
    rows = $("#" + idd + " td").attr('name');
    if (rows === undefined || rows.length <=0) {
        rows = new Array("Job Name", "Job Desc", "Number requested", "Job put on the machine at", "Job put off the machine at", "Number Achieved");
    }
    for(var i = 0; i < rows.length; i++) {
       $("<tr><td>" + rows[i] + "</td><td name=edit><input id='" + rows[i] + "' type=text></input></td></tr>").appendTo("#editdatatable");
    }
    $("<button class='btn btn-default align-left' type='submit'>Submit</button>").on('click', function(e) { e.preventDefault(); submitAddJob(machineType);}).appendTo("#editdata");
    $("<button class='btn btn-default align-left' type='cancel'>Cancel</button>").on('click', function(e) { e.preventDefault(); $.unblockUI();}).appendTo("#editdata");
    $.blockUI({
        message: $('#editdata')
    });
}

function editJob(machineType) {
    var idd = $('#datatable tr[class="success"][name="' + machineType + '"]').attr('id');
    $("#editdata").remove();
    $("<div id='editdata' style='display:none'><p> Edit Job </p><table id='editdatatable' class='table table-bordered' style='width: 80%; height: 80%; margin: auto;'></table></div>").appendTo("body");
    var rows = new Array();
    rows = $("#" + idd + " td");
    if (rows.length <=0) {
        alert("Select atleast one row to edit");
        return false;
    }
    for(var i = 0; i < rows.length; i++) {
        var o = rows[i];
       $("<tr><td>" + $(o).attr('name') + "</td><td name=edit><input id='" + $(o).attr('name') + "' type=text value='" + $(o).text() + "'></input></td></tr>").appendTo("#editdatatable");
    }
    $("<button class='btn btn-default align-left' type='submit'>Submit</button>").on('click', function(e) { e.preventDefault(); submitEditJob(machineType);}).appendTo("#editdata");
    $("<button class='btn btn-default align-left' type='cancel'>Cancel</button>").on('click', function(e) { e.preventDefault(); $.unblockUI();}).appendTo("#editdata");
    $.blockUI({
        message: $('#editdata')
    });
}


$(document).ready(function(e) {
    displayModules();
});