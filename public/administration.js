window.onload = function() {
    var ioSocket = 'http://' + hostname + ':' + port;
    var panelScript = ioSocket + '/panel.js';
    var container = document.getElementById("container");
    var username;
	var socket = io.connect( ioSocket );
 
    /**
     *
     *  Listeners
     *
     */
     
    $("#client").button().on( "click", function() {
        window.location = "client.html";
    });

    $("#administration").button().on( "click", function() {
        registerSocket(socket);
    });


    /**
     *
     *  Sockets
     *
     */
   
	socket.on('status', function (data) {
        // If data contains reply
		if( data.reply == true ) {
            console.log("Authentication successful");
            $("#login").dialog("close");
            $( container ).empty();
            $.getScript( panelScript , function( data, textStatus, jqxhr ) {
                  console.log( data ); // Data returned
                  console.log( textStatus ); // Success
                  console.log( jqxhr.status ); // 200
                  console.log( "Load was performed." );
            });
        } else {
            console.log("Authentication not successful");
            $("#login").dialog("option","title","Please try again");
		}
	});
	
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

function registerSocket(socket) {
    var login = $("<div />", { id: 'login', text: 'Login to Administration'}),
        form = $("<form />", { action: '', method: 'POST' }),
        frmusername = $("<input />", { id: 'username', name: 'username', placeholder: 'Username', type: 'text' }),
        frmpassword = $("<input />", { id: 'password', name: 'password', placeholder: '****', type: 'password' }),
        frmbutton = $("<div />", { id: "submitLogin", text: "Log In" });
    login.append(form, frmusername, frmpassword, $('<br />'), frmbutton).appendTo($("#container"));
    $("#login").dialog({
        autoOpen: true
    });
    $("#submitLogin").button().on( 'click', function(e) {
        e.preventDefault();

        username = $("#username").val();
        var password = $("#password").val();
        
        socket.emit( "register" , { username: username, password: password } );
        socket.emit( "admin" , { method: 'register' });
    });
}

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
