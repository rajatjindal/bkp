function getAuthToken () {
		$.get("/cgi-bin/index.pl",
        {
            email:document.getElementById('email').value,
            password:document.getElementById('password').value
        },
        function(data,status){
            alert("Data: " + data + "\nStatus: " + status);
        });
}


