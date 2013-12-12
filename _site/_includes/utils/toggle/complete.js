if (window.require){
    require(['toolkit'], function(toolkit){
        $('#toggle-already-done .toggle-link').on('click', function() {
            toolkit.toggle({$elClicked:$(this)});
        });
    });
} else {
    $('#toggle-already-done .toggle-link').on('click', function() {
        toolkit.toggle({$elClicked:$(this)});
    });
}