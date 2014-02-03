var elResizeEnd = document.getElementById('css-demo-event-resizeend');

function updateEventResizeEnd(){
    elResizeEnd.innerHTML = 'boom. resized.';
}

toolkit.event.on(window,'resizeend',updateEventResizeEnd);