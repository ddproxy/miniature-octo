/*******************************
*
* Server.js
*
*	Authenticate users information is correct and save to array userCache.
*
********************************/

/*******************************
*
* Requirements
*
********************************/

// Require FS module to check for configuration files
var fs = require( "fs" );

// Require Math
var MATH = require('mathjs');

// Require crypto
// var crypto = require('crypto');

// Require Mysql Module
var mysql = require("mysql");

var express = require( "express" );

// Require Express and cast to app variable
//var express = require( "express" ); Added to require block
var app = express();



// Check configuration files here

fs.exists( "public/config.js", function( exists ) {
	if ( exists ) {
		// Report to console of success
		console.log( "Configuration files found for front-end" );
	} else {
		// Report
		console.err( "Configuration file not found for frontend, please read the README for proper configuration" );
		process.exit( 1 );
	}
});

fs.exists( "private/config.json", function( exists ) {
	if ( exists ) {
		// Report to console of success
		console.log( "Configuration files found for back-end" );
	} else {
		// Report
		console.err( "Configuration file not found for backend, please read the README for proper configuration" );
		process.exit( 1 );
	}
});

// Load configuration file
var config = require( "./private/config.json" );

/*****************************
 *
 * Loading MySQL
 *
 *****************************/
var dbConfig = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
}


// Insert custom mysql connection information here
var db;
function handleDisconnect() {
    db = mysql.createConnection(dbConfig);

    // Custom error handler
    db.connect(function(err) {
        if(err) {
            console.log("Error when connecting to DB:", err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    db.on( "error", function( err ) {
        console.log("Mysql Error:: " + err.code);
        if(err.code === "PROTOCOL_CONNECTION_LOST") {
            handleDisconnect();
        } else {
            throw err;
        }
    });

}

handleDisconnect();

/*******************
* 
* Express and Socket.io
*
*******************/


app.use( express.static( __dirname + '/public' ) );

console.log( "Express is returning public pages" );

// Require Socket.io
// config.port comes from config.json object
var io = require( 'socket.io' ).listen( app.listen( config.port ) );

// IO settings
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1); // Reduce Logging

console.log( "SocketIO is listening to port::" + config.port );

/******************
*
* Cast usable variables
*
*******************/
// userCache -- USer PAssword Cache
var userCache = []; // Current 'database' for information and cache

console.log( "Now Ready" );

/*************************
*
* Listening to sockets
*
**************************/

io.sockets.on( 'connection', function( socket ) {
	// Update admin pages with new data
	function cacheUpdate( data ) {
		
        // Socket room admin emit update
		/**
         * io.sockets.to('admin').emit( 'update', {
			username: data,
			loads: userCache[data].loads,
			timestamp: userCache[data].timestamp,
	    });
        **/
    }
	// On 'register' action
	socket.on( 'register', function( data ) {
		var username = data.username;
		var password = data.password;
		var key;
            if(data.key != null) {
                key = data.key;
            } else {
                key = Math.random().toString(36).substring(7);
            }
        //console.log("Attempting registration for " + username + " with " + password);

		if(userCache[username] && key != null) {
			if(userCache[username].key == key && userCache[username].state == true) {
                // Socket emit status
				socket.emit( 'status', {
					reply : true,
                    username: username,
                    key: key
					});

				// Update admin page
				cacheUpdate( username );
				}
			} else {
				// Authenticate against DB
				db.query("SELECT COUNT(*) as value, id FROM players WHERE username = ? and password = md5( ? )",
					[username, password],
					function(err,info) {
                        console.log(info);
                        if(info != null) {
                            // Return true or false
                            if(info[0].value == '1') {
                                socket.emit( 'log', {
                                    reply : info[0].id
                                });
                                userCache[username] = {
                                    'id' : info[0].id,
                                    'username': username,
                                    'state': true,
                                    'key': key
                                }
                                 socket.emit( 'status', {
                                    reply : true,
                                    username: username,
                                    key: key
                                    });
                            } else {
                                socket.emit( 'status', {
                                    reply : false
                                });
                            }

                        } else {
                                socket.emit( 'status', {
                                    reply : false
                                });
						}
					});
    			}	
	});
    socket.on( 'test', function ( data ) {
        console.log( data );
    });
	/***************************
	*
	* Administrator functions
	*
	****************************/
    function load( socket ) {
        var players = [];
        db.query("SELECT username FROM players WHERE active = 1",
                function ( err, info ) {
                    if( err != null) console.log("Error: " + err );
                    socket.emit('players', info);
                    console.log( info );
                });
    }
	socket.on( 'admin', function( data ) {
		socket.join('admin');
		// console.log(userCache);
		// Send new administrator the cache
		//io.sockets.socket(socket.id).emit( 'cache', userCache);
        load(socket);
    });
    /*********************
     *
     * Menu actions // From Panel.js
     *
     *********************/
    socket.on( 'menu', function ( data ) {
        switch (data.call) {
            case 'logout-menu':
                if(data.key != null && data.username != null) {
                    if( userCache[data.username].key == data.key ) {
                        var index = userCache.indexOf(data.username);
                        if( index > -1 ) userCache.splice( index, 1);
//                        userCache = $.grep( userCache, function(data.username) { return value != data.username; });
                        console.log(data.username + " has logged out");
                        socket.emit('logout', { reply: true });
                    }
                }
                break;
            case 'edit-menu':
                break;
            case'editplayer-menu':
                edit('player', data);
                break;
            case'editcharacter-menu':
                edit('character', data);
                break;
            case'editdungeon-menu':
                edit('dungeon', data);
                break;
            case'createplayer-menu':
                create('player', data);
                break;
            case'createcharacter-menu':
                create('character', data);
                break;
            case'createdungeon-menu':
                create('dungeon', data);
                break;
            case'account-menu':i
                account(data);
                break;
            default:
                break;
        } 
    });

     /***************************
     *
     * Menu Options - Panel
     * functions called by actions
     *
     ***************************/
    
    function edit( type, data ) {
	    db.query("SELECT * FROM ? WHERE ? = ? LIMIT 1",
                [type, data.id, data.key], function( err, info ) {
                    socket.emit(type, info);
        });
    }
    function create( type, data) {

    }
    function account( data ){
        
    }
    
});
