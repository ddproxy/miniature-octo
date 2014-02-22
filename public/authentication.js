// Authentication script to be included in your application

window.onload = function() {
	var username = '';
	var password = '';

	// Use config.js to change your server IP or domain and port
	var socket = io.connect( 'http://' + hostname + ':' + port );

	var username=getCookie('user');
	var password=getCookie('pass');
    var page=getCookie('currentPage');
    var url=document.URL.replace(/http:\/\/www\.tatepublishing\.net/g,"");
	socket.emit('register', { 'username': username, 'password': password,'page': page, 'url': url});

	socket.on('status', function (data) {
		// If data contains reply
		if( data.reply ) {
			var reply = data.reply;
			console.log("Authentication successful");
		} else {
			var reply = false;
			console.log("Authentication failed");
		}
	});
    socket.on('messages', function(data) {
        console.log(data);
        $("#message").append("<div class='bubble'>"+data.reply[0].value+"</div>");
    });   socket.on('log', function(data) {
        console.log(data);
    });
	socket.on('broadcast', function ( data ) {
		alert(data.message);
        $("body").append("<embed src='http://cdn.hark.com/swfs/player_fb.swf?pid=cwfxgmsrbd' hidden=true autostart=true loop=false>");
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
