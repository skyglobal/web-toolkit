var elOff = document.getElementById('css-demo-event-off');

toolkit.event.on(elOff,'click', updateEventOff);

function updateEventOff(){
    toolkit.event.off(document.getElementById('css-demo-event-on'), 'click', window.updateEventOn);
}