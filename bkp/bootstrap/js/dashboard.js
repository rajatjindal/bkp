var currentHeaders;
var currentDisplayedDate;

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
        $("li[class=active]").removeClass("active");
        $("#" + moduleName).addClass("active");
    });
}

var displayModules = function () {
    var modules = getCookie("modules").split(',');
    if (modules.length <= 0 || (modules.length == 1 && modules[0] == "")) {
        window.location = "/bkp/login.html";
        return;
    }
    for(var i=0; i<modules.length; i++) {
        var obj = $( "<li id='" + modules[i] + "'><a href='#" + modules[i] + "'>" + modules[i] + "</a></li>" );
        addJobsListener(obj, modules[i]);
        obj.appendTo( "#modules" );
    }
   
   getHeaders(modules[0]);
   $("#" + modules[0]).addClass("active");
   $("#current_module").remove();
   $("<input id='current_module' type=hidden value='" + modules[0] + "'>").appendTo("body");
}

function getCurrentDate() {
    var d = new Date();
    var day = d.getDate(); if (day <=9) { day = "0" + day }
    var month = d.getMonth() + 1; if (month <=9) { month = "0" + month }
    var date = month + "-" + day + "-" + d.getUTCFullYear();
    var date = "08" + "-" + "03" + "-" + d.getUTCFullYear();
    return date;
}

function getTimeString () {
    var d = currentDisplayedDate;
    var day = d.getDate(); if (day <=9) { day = "0" + day }
    var month = d.getMonth() + 1; if (month <=9) { month = "0" + month }
    var date = month + "-" + day + "-" + d.getUTCFullYear();
    //var date = "08" + "-" + "03" + "-" + d.getUTCFullYear();
    return date;
}

function getDate (offset) {
    var d = currentDisplayedDate;
    
    d.setDate(d.getDate() + offset); 

    var day = d.getDate(); if (day <= 9) { day = "0" + day }
    var month = d.getMonth() + 1; if (month <=9) { month = "0" + month }
    var date = month + "-" + day + "-" + d.getUTCFullYear();
    
    currentDisplayedDate = d;
    
    return date;
}

var getJobs = function (moduleName) {
    
    var form_data = JSON.stringify({
        "date": getTimeString(currentDisplayedDate),
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
        "date": getTimeString(currentDisplayedDate),
        "jobName": $("[id='jobName']").val(),
        "jobCode": $("[id='jobCode']").val(),
        "numberRequested": $("[id='numberRequested']").val(),
        "startTime": $("[id='startTime']").val(),
        "endTime": $("[id='endTime']").val(),
        "numberCompleted": $("[id='numberCompleted']").val(),
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
        "date": getTimeString(currentDisplayedDate),
        "jobName": jobName
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
        "date": getTimeString(currentDisplayedDate),
        "jobName": $("[id='jobName']").val(),
        "jobCode": $("[id='jobCode']").val(),
        "numberRequested": $("[id='numberRequested']").val(),
        "startTime": $("[id='startTime']").val(),
        "endTime": $("[id='endTime']").val(),
        "numberCompleted": $("[id='numberCompleted']").val(),
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
            currentHeaders = data;
            displayHeaders(data);
            getJobs(moduleName);
        }
    });    
}

var displayHeaders = function (data) {
    $("#datatable").remove();

    $( "<table id='datatable' class='table table-bordered'><tr><th colspan=" + (data.length + 1) + ">" + getTimeString(currentDisplayedDate) + "</th></tr><tr id='header'></tr></table>" ).appendTo( "#starter-template" );
    
    jQuery.each(data, function(){
        $("<th> " + this['displayName'] + "</th>").appendTo( "#header" );   
    });
    $("<th></th>").appendTo( "#header" );
}

var displayJobs = function (data) {
    var rowCount = 0;
    jQuery.each(data, function () {
        jQuery.each(this, function(machineType, rows) {
            var rowId = "row_" + rowCount;
            $( "<tr id='row_" + rowCount + "'><td colspan=7><table data-machinetype='" + machineType + "' class='table table-striped'></table></td></tr>").appendTo( "#datatable" );
            
            rowCount = rowCount + 1;
            rowId = "row_" + rowCount;
            var buttonTH = "buttonth_" + rowCount;
            
            //$( "<tr id='row_" + rowCount + "'><th colspan=2>" + machineType + "</th><th width=60% class='align-right' id=" + buttonTH + "></th><th colspan=5>&nbsp;</th></tr>" ).appendTo( $("table").find('[data-machineType="' + machineType + '"]'));
            
            $( "<tr id='row_" + rowCount + "'><th colspan=7 id=" + buttonTH + " >" + machineType + "&nbsp;&nbsp;</th></tr>" ).appendTo( $("table").find('[data-machineType="' + machineType + '"]'));
            
            //$("<button class='btn btn-primary align-left btn-xs' type='submit'>Create new</button>").on('click', function(e) { e.preventDefault(); addJob(machineType);}).appendTo("#" + buttonTH);
            if(isAdmin()) {
                $("<span class='glyphicon glyphicon-plus' data-toggle='tooltip' data-placement='right' title='Add new'></span>").on('click', function(e) { e.preventDefault(); addJob(machineType);}).appendTo("#" + buttonTH);
            }
            
            jQuery.each(rows, function () {
                var value = this;
                
                rowCount = rowCount + 1;
                var rowId = "row_" + rowCount;
                $("<tr name='" + machineType + "' id='row_" + rowCount + "' title='Double click to edit' data-toggle='tooltip' data-placement='top'></tr>" )
                .on('dblclick', function(event) { editJob(rowId, machineType); $(this).addClass('success1').siblings().removeClass('success1'); })
                .appendTo( "#datatable" );
                
                jQuery.each(currentHeaders, function(){
		    var val = this;
		    var bgcol = getBackgroundColor(val['id']);
		    $("<td " + bgcol + " name='" + val['id'] + "'>" + value[val['id']] + "</td>").appendTo("#" + rowId);
		});
		
                //$("<td name='jobName'>" + value['jobName'] + "</td>").appendTo("#" + rowId);   
                //$("<td name='jobCode'>" + value['jobCode'] + "</td>").appendTo("#" + rowId);   
                //$("<td name='numberRequested'>" + value['numberRequested'] + "</td>").appendTo("#" + rowId);   
                //$("<td name='startTime'" + getBackgroundColor('startTime') + ">" + value['startTime'] + "</td>").appendTo("#" + rowId);   
                //$("<td name='endTime'" + getBackgroundColor('startTime') + ">" + value['endTime'] + "</td>").appendTo("#" + rowId);   
                //$("<td name='numberCompleted'" + getBackgroundColor('startTime') + ">" + value['numberCompleted'] + "</td>").appendTo("#" + rowId);
                
                //$("<td id=" + rowId + "_delete name='delete'><img src='http://icons.iconarchive.com/icons/oxygen-icons.org/oxygen/24/Actions-window-close-icon.png'></img></td>").on('click', function(e) { e.preventDefault(); deleteJob(rowId, machineType)}).appendTo("#" + rowId);
                if(isAdmin()) {
                    $("<td id=" + rowId + "_delete name='delete'><span class='glyphicon glyphicon-remove' data-toggle='tooltip' data-placement='right'  title='Delete this job'></span></td>").on('click', function(e) { e.preventDefault(); deleteJob(rowId, machineType)}).appendTo("#" + rowId);
                }
            	
                 
            })
        })
    }); 
    $(function () { 
        $("[data-toggle='tooltip']").tooltip(); 
    });;
}

function deleteJob(idd, machineType) {
    $("#editdata").remove();
    var rows = new Array();
    rows = $("#" + idd + " td");
    if (rows.length <=0) {
        alert("Select atleast one row to delete");
        return false;
    }
    if (confirm("Are you sure you want to delete this job")) {
        var jobName = $("#" + idd + " td[name='jobName']").text();
        submitDeleteJob(machineType, jobName);
    }
}


function addJob(machineType) {
    var idd = $('#datatable tr[name="' + machineType + '"]').first().attr('id');
    $("#editdata").remove();
    $("<div id='editdata' style='display:none'><p> <b>Add new Job </b></p><table id='editdatatable' class='table table-bordered' style='width: 80%; height: 80%; margin: auto;'></table></div>").appendTo("body");
    
    var rows = new Array();
    
    $("#" + idd).find('td').each(function() {
        rows.push(this.getAttribute('name'));
    });
    if (rows === undefined || rows.length <= 0) {
        rows = new Array("jobName", "jobCode", "numberRequested", "startTime", "endTime", "numberCompleted");
    }
    
    for(var i = 0; i < rows.length; i++) {
        if(rows[i] == 'delete') { continue; }
        var bgcol = getBackgroundColor(rows[i]);
        if (rows[i] == "startTime" || rows[i] == "endTime") {
           $("<tr><td " + bgcol + ">" + getDisplayName(rows[i]) + "</td><td name=edit  " + bgcol + "><input <input name='setTimeExample' type='text' class='time ui-timepicker-input' autocomplete='off' id='" + rows[i] + "'></input></td></tr>").appendTo("#editdatatable");
           $('input[name="setTimeExample"]').timepicker();
        } else {
           $("<tr><td " + bgcol + ">" + getDisplayName(rows[i]) + "</td><td name=edit " + bgcol + "><input id='" + rows[i] + "' type=text></input></td></tr>").appendTo("#editdatatable");
        }
    }
    
    $("<button class='btn btn-default align-left' type='submit'>Submit</button>").on('click', function(e) { e.preventDefault(); submitAddJob(machineType);}).appendTo("#editdata");
    $("<button class='btn btn-default align-left' type='cancel'>Cancel</button>").on('click', function(e) { e.preventDefault(); $.unblockUI();}).appendTo("#editdata");
    $.blockUI({
        message: $('#editdata')
    });
}

function getDisplayName (id) {
    var display = id;
    jQuery.each(currentHeaders, function(){
        var val = this;
        if(val['id'] == id) {
            display = val['displayName'];
            console.log(val['id'] + ':' + id + ':' + display); 
            return false;
        }
    });
    return display;
}

function getDisabledString (id) {
    if(isAdmin()) {
        return "";
    }
    
    var str = "disabled";
    jQuery.each(currentHeaders, function(){
        var val = this;
        if(val['id'] == id) {
            var adminOnly = val['adminOnly'];
            if(adminOnly == 0) {
                str = "";
            }
            return false;
        }
    });
    return str;
}

function getTypeOfColumn (id) {
    var type;
    jQuery.each(currentHeaders, function(){
        var val = this;
        if(val['id'] == id) {
            type = val['type'];
            console.log(val['id'] + ':' + id + ':' + type); 
            return false;
        }
    });
    return type;
}

function isAdmin () {
    if(getCookie('isAdmin') == 0) {
        return 0;
    } else {
        return 1;
    }
}

function getBackgroundColor(id) {
    if(isAdmin()) {
        return "";
    }
    if(id == "endTime" || id == "startTime" || id == "numberCompleted") {
        return "bgcolor=yellow";
    } else {
        return "";
    }
}

function editJob(idd, machineType) {
    $("#editdata").remove();
    $("<div id='editdata' style='display:none'><p><b> Edit Job</b> </p><table id='editdatatable' class='table table-bordered' style='width: 80%; height: 80%; margin: auto;'></table></div>").appendTo("body");
    var rows = new Array();
    $("#" + idd).find('td').each(function() {
        rows.push(this);
    });
    
    if (rows.length <=0) {
        alert("Select atleast one row to edit");
        return false;
    }
    for(var i = 0; i < rows.length; i++) {
        var o = rows[i];
        var n = rows[i].getAttribute('name');
        var t = o.innerText || o.textContent || o.value || "";
        var bgcol = getBackgroundColor(n);
        
        if(n == 'delete') { continue; }
        
        var type = getTypeOfColumn(n);
        
        if (type == "time") {
           $("<tr><td " + bgcol + ">" + getDisplayName($(o).attr('name')) + "</td><td name=edit " + bgcol + "><input id='" + $(o).attr('name') + "' name='setTimeExample' type='text' class='time ui-timepicker-input' autocomplete='off' id='" + $(o).attr('name') + "' value='" + t + "'></input></td></tr>").appendTo("#editdatatable");
           $('input[name="setTimeExample"]').timepicker();
        } else {
           $("<tr><td " + bgcol + ">" + getDisplayName(n) + "</td><td name=edit " + bgcol + "><input id='" + n + "' type=text value='" + t + "'" + getDisabledString(n) + "></input></td></tr>").appendTo("#editdatatable");
        }
    }
    $("<button class='btn btn-default align-left' type='submit'>Submit</button>").on('click', function(e) { e.preventDefault(); submitEditJob(machineType);}).appendTo("#editdata");
    $("<button class='btn btn-default align-left' type='cancel'>Cancel</button>").on('click', function(e) { e.preventDefault(); $.unblockUI();}).appendTo("#editdata");
    $.blockUI({
        message: $('#editdata')
    });
}

function displayYesterday () {
    getDate(-1);
    getHeaders($("#current_module").val());
}


function displayTomorrow () {
    getDate(1);
    getHeaders($("#current_module").val());
}

function displayToday () {
    currentDisplayedDate = new Date();
    getHeaders($("#current_module").val());
}

$(document).ready(function(e) {
    currentDisplayedDate = new Date();
    displayModules();
    $("#today").on('click', function(e) { e.preventDefault(); displayToday()});
    $("#tomorrow").on('click', function(e) { e.preventDefault(); displayTomorrow()});
    $("#yesterday").on('click', function(e) { e.preventDefault(); displayYesterday()});
});