window.onload = function() {
	
	var username=getCookie('user');
	var password=getCookie('pass');
    
        
    var container = document.getElementById("container");

    /**
     *
     *  Listeners
     *
     */
     
    $("#client").button().on( "click", function() {
        window.location = "client.html";
    });

    $("#administration").button().on( "click", function() {
        registerSocket();
    });


    /**
     *
     *  Sockets
     *
     */
	var socket = io.connect( 'http://' + hostname + ':' + port );
    
    socket.emit('register', { 'username': username, 'password': password,'page': 'admin'});

	socket.on('status', function (data) {
		// If data contains reply
		if( data.reply ) {
			var reply = data.reply;
			console.log("Authentication successful");
		} else {
			var reply = false;
			alert("Authentication failed");
		}
	});
	
    socket.emit('admin', { 'username': 'admin' });

	socket.on( 'update', function ( data ) {
		console.log(data);
		
		var row = document.getElementById(data.username);
		if ( row!=null ) {
			row.parentNode.removeChild(row);
			}
	});

	socket.on('cache', function ( data ) {
		$.each(data, function (key, value) {
	        console.log(value);
        });
	});
}

/*
 *
 *  Functions
 *
 */
function renderStat(element, index, array) {
    var string = "<br />[" + index + "] is " + element ;
    return string;
}

function getCookie(c_name) {
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
		c_start = c_value.indexOf(c_name + "=");
	}
	if (c_start == -1){
		c_value = null;
	} else {
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) {
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}
