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

$(document).ready(function(e) {
    
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        var form_data = JSON.stringify({
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value
        });
        var form_url = $(this).attr("action");
        var form_method = $(this).attr("method").toUpperCase();
        alert(form_data);
        $.ajax({
            url: form_url, 
            type: form_method,      
            data: form_data,     
            cache: false,
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            success: function(data, textStatus, xhr) {
                console.log(data);
                window.location = "/bkp/dashboard.html";
            }
        });    
        
    });
});