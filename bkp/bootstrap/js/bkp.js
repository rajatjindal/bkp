(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

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

$(document).ready(function(e) {
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        var form_data = JSON.stringify({
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value
        });
        var form_url = $(this).attr("action");
        var form_method = $(this).attr("method").toUpperCase();
        $.ajax({
            url: form_url, 
            type: form_method,      
            data: form_data,     
            cache: false,
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            success: function(data, textStatus, xhr) {
                console.log(data);
                setCookie("u", document.getElementById('email').value, 4);
                setCookie("modules", data);
                window.location = "/bkp/dashboard.html";
            }
        });    
    });
});