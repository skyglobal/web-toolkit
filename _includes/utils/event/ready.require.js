require(['toolkit'], function(toolkit){

    function updateEventReady(){
        $('#css-demo-event-ready').text('Woah, document loaded.');
    }

    toolkit.event.ready(updateEventReady);
});