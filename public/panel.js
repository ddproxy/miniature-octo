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
    });

}
