function myHashCallback() {
    $('#currentHash').text(location.hash);
}

if (window.require){
    require(['toolkit'], function(toolkit){
        toolkit.hashManager.register(['hash', 'anotherHash'], myHashCallback);
    });
} else {
    toolkit.hashManager.register(['hash', 'anotherHash'], myHashCallback);
}