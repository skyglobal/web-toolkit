var elResizeEnd = document.getElementById('css-demo-event-resizeend');

function updateEventResizeEnd(){
    $(elResizeEnd).text('boom. resized.');
}

toolkit.event.on(window,'resizeend',updateEventResizeEnd);