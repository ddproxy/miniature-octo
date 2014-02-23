
window.onload = function() {
	
	var username=getCookie('user');
	var password=getCookie('pass');
    
        
    var content = document.getElementById("content");
	var html = '';

	function renderStat(element, index, array) {
	  html += "<br />[" + index + "] is " + element ;
	}
	
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
//            window.location = "../";
		}
	});
	
    socket.emit('admin', { 'username': 'admin' });

	socket.on( 'update', function ( data ) {
		console.log(data);
		
		var row = document.getElementById(data.username);
		if ( row!=null ) {
			row.parentNode.removeChild(row);
			}
	
		var rowelement = document.createElement('tr');
		rowelement.setAttribute("id", data.username);
		rowelement.setAttribute("style", "background-color: rgb(0,255,0);font-weight: bold;");
		var tdelement = document.createElement('td');
		var textelement = document.createTextNode(data.username);
		tdelement.appendChild(textelement);
		rowelement.appendChild(tdelement);
		var tdelement1 = document.createElement('td');
		var textelement1 = document.createTextNode(data.loads);
		tdelement1.appendChild(textelement1);
		rowelement.appendChild(tdelement1);

		var date = new Date(data.timestamp*1000);
		var hours = date.getHours();
		var minutes = date.getMinutes();
		if (minutes < 10) {
			minutes = "0"+minutes;
		}
		var seconds = date.getSeconds();
		if (seconds < 10) {
			seconds = "0"+seconds;
		}
					
		var tdelement2 = document.createElement('td');
		var textelement2 = document.createTextNode(hours + ":" + minutes + ":" + seconds );
		tdelement2.appendChild(textelement2);
		rowelement.appendChild(tdelement2);
	    
        var tdelement3 = document.createElement('td');
		var textelement3 = document.createTextNode(data.page);
		tdelement3.appendChild(textelement3);
		rowelement.appendChild(tdelement3);
		
		var tdelement4 = document.createElement('td');
		var textelement4 = document.createTextNode(data.url);
		tdelement4.appendChild(textelement4);
		rowelement.appendChild(tdelement4);
		
		content.insertBefore(rowelement, content.firstChild);
		$(rowelement).animate({backgroundColor:"rgb(255,255,0)"}, 10000);
		$(rowelement).animate({backgroundColor:"rgb(255,0,0)"}, 100000);
	});

	socket.on('cache', function ( data ) {
		$.each(data, function (key, value) {
			html += "<tr id='" + key + "'>";
			$.each(value, function (key, value) {
				if ((key == 'password') || (key == 'state')) {
				} else if(key == 'timestamp') {
					var date = new Date(value*1000);
					var hours = date.getHours();
					var minutes = date.getMinutes();
					var seconds = date.getSeconds();
					html += "<td>" + hours + ":" + minutes + ":" + seconds + "</td>";
				} else {
					html += "<td>" + value + "</td>";
				}
			});
			html += "</tr>";
		});
		content.innerHTML = html;
	});

	$("#broadcast").click( function() {
		var text = field.value;
		socket.emit('broadcast', { message: text} );
		field.value = "";
	});
	
	socket.on('broadcast', function ( data ) {
		alert(data.message);
	});

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
