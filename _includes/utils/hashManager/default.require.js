require(['toolkit'], function(toolkit){
    function myHashCallback() {
        $('#currentHash').text(location.hash);
    }
    toolkit.hashManager.register(['hash', 'anotherHash'], myHashCallback);
});