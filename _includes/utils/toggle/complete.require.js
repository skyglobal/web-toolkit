require(['toolkit'], function(toolkit){
    $('#toggle-already-done .toggle-link').on('click', function() {
        toolkit.toggle({$elClicked:$(this)});
    });
});