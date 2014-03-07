window.onload = function() {
    var ioSocket = 'http://' + hostname + ':' + port;
    var container = document.getElementById("container");
    var username = getCookie('username');
    var key = getCookie('key'); 
	var socket = io.connect( ioSocket );

    socket.emit( 'register', { username: username, key: key });
	socket.on('status', function (data) {
        // If data contains reply
		if( data.reply == true ) {
            console.log("Authentication successful");
        } else {
            console.log("Authentication not successful");
            deleteCookie('key');
            deleteCookie('username');
            key = null;
            username = null;
            window.location = "index.html";
		}
	});
    // Logout
    socket.on( 'logout' , function ( data ) {
        if( data.reply == true) window.location = "index.html";
    });

    // Players
    socket.on( 'players' , function ( data ) {
        console.log( data );
        $("#players").empty();
        $("#players").append("<h2>Players</h2>");
        $("#players").append("<ul id='player-list'></ul>");
        $(data).each( function( key, value) {
            $(value).each( function( key, value) {
                $("#player-list").append("<li id='" + value.username + "' class='ui-widget-content'>" + value.username + "</li>");
            });
        });
        $("#player-list").selectable();
    });
    socket.on( 'player' , function ( data ) {
        console.log( data );
    });

    // Characters
    socket.on( 'characters' , function ( data ) {
        console.log( data );

    });
    socket.on( 'character' , function ( data ) {
        console.log( data );

    });

    // Dungeons
    socket.on( 'dungeons' , function ( data ) {
        console.log( data );

    });
    socket.on( 'dungeon' , function ( data ) {
        console.log( data );

    });

    // Monsters
    socket.on( 'monsters' , function ( data ) {
        console.log( data );

    });
    socket.on( 'monster' , function ( data ) {
        console.log( data );

    });
    
    // Inventory
    socket.on( 'inventory' , function ( data ) {
        console.log( data );

    });
 
    var menu = $("<div />", { id: 'menu', class: 'box size11 ui-widget-content', text: username }),
        players = $("<div />", { id: 'players', class: 'box size12 ui-widget-content', text: "Loading players" }),
        characters = $("<div />", { id: 'characters', class: 'box size12 ui-widget-content', text: "Loading Characters" }),
        dungeons = $("<div />", { id: 'dungeons', class: 'box size12 ui-widget-content', text: "Loading dungeons" }),
        monsters = $("<div />", { id: 'monsters', class: 'box size12 ui-widget-content', text: "Select dungeon to populate monster list." }),
        map = $("<div />", { id: 'map', class: 'box size 22 ui-widget-content', text: "Select dungeon to display map." });
    $("#container").append(menu, players, characters, dungeons, monsters, map).nested({
        minWidth: 200,
        gutter: 10
    });

    $(function () {

        var data = {
            menu: [{
                name: 'Account',
                link: 'account',
                sub: null
            }, {
                name: 'Create',
                link: 'create',
                sub: [{
                    name: 'Player',
                    link: 'player',
                    sub: null
                }, {
                    name: 'Character',
                    link: 'character',
                    sub: null
                }, {
                    name: 'Dungeon',
                    link: 'dungeon',
                    sub: null
                }]
            }, {
                name: 'Edit',
                link: 'edit',
                sub: [{
                    name: 'Player',
                    link: 'player',
                    sub: null
                }, {
                    name: 'Character',
                    link: 'character',
                    sub: null
                }, {
                    name: 'Dungeon',
                    link: 'dungeon',
                    sub: null
                }]
            }, {
                name: 'Logout',
                link: 'logout',
                sub: null
            }]
        };
        var getMenuItem = function (itemData, p) {
            p = typeof p != 'undefined' ? p : '';
            var item = $("<li>")
                .append(
            $("<a>", {
                href: '#' + itemData.link,
                class: p + itemData.link,
                id: p + itemData.link + "-menu",
                html: itemData.name
            }));
            if (itemData.sub) {
                var subList = $("<ul>");
                $.each(itemData.sub, function (ps) {
                    subList.append(getMenuItem(this, itemData.link) );
                });
                item.append(subList);
            }
            return item;
        };
        
        var $menu = $("#menu");
        $.each(data.menu, function () {
            $menu.append(
                getMenuItem(this)
            );
        });
        $menu.menu();
        $(menu).on('click', function( e ) {
            if($(this).attr('id') != null) {
                socket.emit( 'menu', {
                    call: $(e.target).attr('id'),
                    key: key,
                    username: username
                } );
            }
        });
        socket.emit('admin', { data: true });
    });
}
