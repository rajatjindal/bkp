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
        alert("here");
        window.location = "/bkp/login.html";
    }
    for(var i=0; i<modules.length; i++) {
        $( "<li><a href='#" + modules[i] + "'>" + modules[i] + "</a></li>" ).appendTo( "#modules" );
    }
}

$(document).ready(function(e) {
    displayModules();
});