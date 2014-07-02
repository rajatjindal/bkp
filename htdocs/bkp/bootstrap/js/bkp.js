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
    
    $("form[ajax=true]").submit(function(e) {
        e.preventDefault();
        var form_data = $(this).serializeFormJSON();
        var form_url = $(this).attr("action");
        var form_method = $(this).attr("method").toUpperCase();
        
        $("#loadingimg").show();
        
        $.ajax({
            url: form_url, 
            type: form_method,      
            data: form_data,     
            cache: false,
            beforeSend: function(xhr){xhr.setRequestHeader('Content-Type', 'application/json');},
            success: function(returnhtml){
                alert(returnhtml);
                $("#result").html(returnhtml); 
                $("#loadingimg").hide();                    
            }           
        });    
        
    });
    
});