$(document).ready(function(e) {
    
    $("form[ajax=true]").submit(function(e) {
        e.preventDefault();
        var form_data = $(this).serialize();
        alert(form_data);
        var form_url = $(this).attr("action");
        var form_method = $(this).attr("method").toUpperCase();
        
        $("#loadingimg").show();
        
        $.ajax({
            url: form_url, 
            type: form_method,      
            data: form_data,     
            cache: false,
            success: function(returnhtml){
                alert(returnhtml);
                $("#result").html(returnhtml); 
                $("#loadingimg").hide();                    
            }           
        });    
        
    });
    
});