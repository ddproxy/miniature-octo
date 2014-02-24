var menu = $("<div />", { id: 'menu', text: username }),
    players = $("<div />", { id: 'players', class: 'ui-widget-content', text: "Loading players" }),
    characters = $("<div />", { id: 'characters', class: 'ui-widget-content', text: "Loading Characters" }),
    dungeons = $("<div />", { id: 'dungeons', class: 'ui-widget-content', text: "Loading dungeons" }),
    monsters = $("<div />", { id: 'monsters', class: 'ui-widget-content', text: "Select dungeon to populate monster list." }),
    map = $("<div />", { id: 'map', class: 'ui-widget-content', text: "Select dungeon to display map." });
$("#container").append(menu, players, characters, dungeons, monsters, map);
