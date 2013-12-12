if (window.require){
    require(['toolkit'], function(toolkit){
        $('#toggle-by-element .toggle-link').on('click', function() {
            toolkit.toggle({$elClicked:$(this)});
        });
    });
} else {
    $('#toggle-by-element .toggle-link').on('click', function() {
        toolkit.toggle({$elClicked:$(this)});
    });
}